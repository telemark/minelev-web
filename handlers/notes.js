const axios = require('axios')
const getDocumentTemplate = require('document-templates')
const code = require('crypto-props')
const config = require('../config')
const prepareDocument = require('../lib/prepare-document')
const prepareDocumentPreview = require('../lib/prepare-document-preview')
const generateSystemJwt = require('../lib/generate-system-jwt')
const createViewOptions = require('../lib/create-view-options')
const createPreview = require('../lib/create-preview')
const datePadding = require('../lib/date-padding')
const getTemplateType = require('../lib/get-template-type')
const getProfilePicture = require('../lib/get-profile-picture')
const putData = require('../lib/put-data')
const logger = require('../lib/logger')

module.exports.write = async (request, h) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentUserName
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}`
  const urlContactTeachers = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}/contactteachers`
  let mainGroupName = false

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses })

  logger('info', ['notes', 'write', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  let results, contactTeachersResult, profilePicture
  try {
    axios.defaults.headers.common.Authorization = token

    // Retrieve students, contactteachers and picture
    results = await axios.get(url)
    contactTeachersResult = await axios.get(urlContactTeachers)
    profilePicture = await getProfilePicture(studentUserName)
  } catch (error) {
    const status = error.response.status
    logger('error', ['documents', 'write', 'userId', userId, 'studentUserName', studentUserName, 'unable to get data', error.response.config.url, status, error])

    if (status === 401 || status === 403) {
      return h.view('error-no-access-to-student', { ...viewOptions, statusCode: status })
    } else {
      return h.view('error', { ...viewOptions, statusCode: 500 })
    }
  }

  const payload = results.data
  const contactTeachers = contactTeachersResult.data
  if (contactTeachers.length > 0) {
    mainGroupName = contactTeachers[0].groupId
    logger('info', ['notes', 'write', 'userId', userId, 'studentUserName', studentUserName, 'mainGroupName', mainGroupName])
  } else {
    logger('error', ['notes', 'write', 'userId', userId, 'studentUserName', studentUserName, 'contactTeachers not found'])
  }
  if (!payload.statusKode) {
    const student = payload[0]
    const today = new Date()
    viewOptions.student = student
    viewOptions.skjemaUtfyllingStart = today.getTime()
    viewOptions.thisDay = `${today.getFullYear()}-${datePadding(today.getMonth() + 1)}-${datePadding(today.getDate())}`
    if (profilePicture !== false) {
      logger('info', ['notes', 'write', 'userId', userId, 'studentUserName', studentUserName, 'retrieved profile picture'])
      viewOptions.profilePicture = profilePicture.data
    }

    logger('info', ['notes', 'write', 'userId', userId, 'studentUserName', studentUserName, 'student data retrieved'])
    if (mainGroupName !== false) {
      return h.view('note', viewOptions)
    } else {
      return h.view('error-missing-contact-teacher', viewOptions)
    }
  }
  if (payload.statusKode === 401) {
    logger('info', ['notes', 'write', 'userId', userId, 'studentUserName', studentUserName, '401'])
    return h.redirect('/signout')
  }
}

module.exports.generatePreview = async (request, h) => {
  const user = request.auth.credentials.data
  const data = request.payload
  data.userId = user.userId
  data.userName = user.userName
  data.userAgent = request.headers['user-agent']
  const postData = prepareDocument(data)
  const previewData = prepareDocumentPreview(postData)
  const documentTemplate = getDocumentTemplate({ domain: 'minelev', templateId: getTemplateType(postData) })
  const template = documentTemplate.filePath

  logger('info', ['notes', 'generatePreview', 'userId', data.userId, 'studentUserName', data.studentUserName, 'start'])

  const prewiewDocument = await createPreview(template, previewData)
  return prewiewDocument
}

module.exports.submit = async (request, h) => {
  const yar = request.yar
  const user = request.auth.credentials.data
  const data = request.payload
  data.userId = user.userId
  data.userName = user.userName
  data.userAgent = request.headers['user-agent']
  const postData = prepareDocument(data)
  const encrypted = code({
    secret: config.NOTES_KEY,
    data: postData,
    method: 'encrypt'
  })
  postData.isQueued = false
  postData.documentContent = ''
  postData.documentStatus = [
    {
      timeStamp: new Date().getTime(),
      status: 'Sendt til elevmappa'
    }
  ]

  logger('info', ['notes', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, 'start'])

  try {
    await putData({
      config: {
        userId: data.userId,
        secret: config.NOTES_SERVICE_SECRET
      },
      url: config.NOTES_SERVICE_URL,
      data: encrypted
    })

    await putData({
      config: {
        userId: data.userId,
        secret: config.JWT_SECRET
      },
      url: config.QUEUE_SERVICE_URL,
      data: postData
    })

    logger('info', ['notes', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, 'submitted'])
    yar.set('documentAdded', true)
    return h.redirect('/')
  } catch (error) {
    logger('error', ['notes', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, error])
    yar.set('documentAdded', false)
    return h.redirect('/')
  }
}
