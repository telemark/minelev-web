const axios = require('axios')
const getDocumentTemplate = require('document-templates')
const config = require('../config')
const prepareDocument = require('../lib/prepare-document')
const prepareDocumentPreview = require('../lib/prepare-document-preview')
const documents = require('../lib/data/documents.json')
const courseCategory = documents.courses
const order = documents.order
const behaviour = documents.behaviour
const documentTypes = documents.categories
const samtale = documents.samtale
const warningPeriods = documents.period
const generateSystemJwt = require('../lib/generate-system-jwt')
const createViewOptions = require('../lib/create-view-options')
const createPreview = require('../lib/create-preview')
const datePadding = require('../lib/date-padding')
const getTemplateType = require('../lib/get-template-type')
const getProfilePicture = require('../lib/get-profile-picture')
const logger = require('../lib/logger')

function filterDocumentTypes (contactTeacher) {
  const filteredList = []
  documentTypes.forEach(type => {
    if (type.id === 'fag' || contactTeacher) {
      filteredList.push(type)
    }
  })
  return filteredList
}

module.exports.write = async (request, h) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentUserName
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}`
  const urlContactTeachers = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}/contactteachers`
  let mainGroupName = false

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, order: order, behaviour: behaviour, courseCategory: courseCategory, samtale: samtale, documentTypes: documentTypes, warningPeriods: warningPeriods })

  logger('info', ['documents', 'write', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  axios.defaults.headers.common['Authorization'] = token
  // Retrieves student and students contactTeachers
  const [results, contactTeachersResult, profilePicture] = await Promise.all([axios.get(url), axios.get(urlContactTeachers), getProfilePicture(studentUserName)])
  const payload = results.data
  const contactTeachers = contactTeachersResult.data
  if (contactTeachers.length > 0) {
    mainGroupName = contactTeachers[0].groupId
    logger('info', ['documents', 'write', 'userId', userId, 'studentUserName', studentUserName, 'mainGroupName', mainGroupName])
  } else {
    logger('error', ['documents', 'write', 'userId', userId, 'studentUserName', studentUserName, 'contactTeachers not found'])
  }
  if (!payload.statusKode) {
    const student = payload[0]
    const today = new Date()
    student.mainGroupName = mainGroupName
    viewOptions.student = student
    viewOptions.warningTypes = filterDocumentTypes(student.contactTeacher)
    viewOptions.skjemaUtfyllingStart = today.getTime()
    viewOptions.thisDay = `${today.getFullYear()}-${datePadding(today.getMonth() + 1)}-${datePadding(today.getDate())}`
    if (profilePicture !== false) {
      logger('info', ['documents', 'write', 'userId', userId, 'studentUserName', studentUserName, 'retrieved profile picture'])
      viewOptions.profilePicture = profilePicture.data
    }

    logger('info', ['documents', 'write', 'userId', userId, 'studentUserName', studentUserName, 'student data retrieved'])
    if (mainGroupName !== false) {
      return h.view('document', viewOptions)
    } else {
      return h.view('error-missing-contact-teacher', viewOptions)
    }
  }
  if (payload.statusKode === 401) {
    logger('info', ['documents', 'write', 'userId', userId, 'studentUserName', studentUserName, '401'])
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

  logger('info', ['documents', 'generatePreview', 'userId', data.userId, 'studentUserName', data.studentUserName, 'start'])

  const prewiewDocument = await createPreview(template, previewData)
  return prewiewDocument
}

module.exports.submit = async (request, h) => {
  const yar = request.yar
  const user = request.auth.credentials.data
  const token = generateSystemJwt(user.userId)
  const url = `${config.QUEUE_SERVICE_URL}`
  const data = request.payload
  data.userId = user.userId
  data.userName = user.userName
  data.userAgent = request.headers['user-agent']
  const postData = prepareDocument(data)

  postData.documentStatus = [
    {
      timeStamp: new Date().getTime(),
      status: 'I kø'
    }
  ]

  axios.defaults.headers.common['Authorization'] = token

  logger('info', ['documents', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, 'start'])

  try {
    await axios.put(url, postData)
    logger('info', ['documents', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, 'submitted'])
    yar.set('documentAdded', true)
    return h.redirect('/')
  } catch (error) {
    logger('error', ['documents', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, error])
    yar.set('documentAdded', false)
    return h.redirect('/')
  }
}
