const fs = require('fs')
const axios = require('axios')
const getDocumentTemplatesPath = require('tfk-saksbehandling-minelev-templates')
const FormData = require('form-data')
const code = require('crypto-props')
const config = require('../config')
const prepareDocument = require('../lib/prepare-document')
const prepareDocumentPreview = require('../lib/prepare-document-preview')
const generateSystemJwt = require('../lib/generate-system-jwt')
const createViewOptions = require('../lib/create-view-options')
const datePadding = require('../lib/date-padding')
const getTemplateType = require('../lib/get-template-type')
const getProfilePicture = require('../lib/get-profile-picture')
const putData = require('../lib/put-data')
const logger = require('../lib/logger')

module.exports.write = async (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentUserName
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}`
  const urlContactTeachers = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}/contactteachers`
  let mainGroupName = false

  let viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses })

  logger('info', ['notes', 'write', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  axios.defaults.headers.common['Authorization'] = token
  // Retrieves student and students contactTeachers
  const [results, contactTeachersResult, profilePicture] = await Promise.all([axios.get(url), axios.get(urlContactTeachers), getProfilePicture(studentUserName)])
  const payload = results.data
  const contactTeachers = contactTeachersResult.data
  if (contactTeachers.length > 0) {
    mainGroupName = contactTeachers[0].groupId
    logger('info', ['notes', 'write', 'userId', userId, 'studentUserName', studentUserName, 'mainGroupName', mainGroupName])
  } else {
    logger('error', ['notes', 'write', 'userId', userId, 'studentUserName', studentUserName, 'contactTeachers not found'])
  }
  if (!payload.statusKode) {
    let student = payload[0]
    const today = new Date()
    student.mainGroupName = mainGroupName
    viewOptions.student = student
    viewOptions.skjemaUtfyllingStart = today.getTime()
    viewOptions.thisDay = `${today.getFullYear()}-${datePadding(today.getMonth() + 1)}-${datePadding(today.getDate())}`
    if (profilePicture !== false) {
      logger('info', ['notes', 'write', 'userId', userId, 'studentUserName', studentUserName, 'retrieved profile picture'])
      viewOptions.profilePicture = profilePicture.data
    }

    logger('info', ['notes', 'write', 'userId', userId, 'studentUserName', studentUserName, 'student data retrieved'])
    if (mainGroupName !== false) {
      reply.view('note', viewOptions)
    } else {
      reply.view('error-missing-contact-teacher', viewOptions)
    }
  }
  if (payload.statusKode === 401) {
    logger('info', ['notes', 'write', 'userId', userId, 'studentUserName', studentUserName, '401'])
    reply.redirect('/signout')
  }
}

module.exports.generatePreview = (request, reply) => {
  const user = request.auth.credentials.data
  let data = request.payload
  data.userId = user.userId
  data.userName = user.userName
  data.userAgent = request.headers['user-agent']
  const postData = prepareDocument(data)
  const previewData = prepareDocumentPreview(postData)
  const template = getDocumentTemplatesPath(getTemplateType(postData))
  let templaterForm = new FormData()

  logger('info', ['notes', 'generatePreview', 'userId', data.userId, 'studentUserName', data.studentUserName, 'start'])

  Object.keys(previewData).forEach(key => {
    templaterForm.append(key, previewData[key])
  })

  templaterForm.append('file', fs.createReadStream(template))

  templaterForm.submit(config.PDF_SERVICE_URL, (error, docx) => {
    if (error) {
      logger('error', ['notes', 'generatePreview', 'userId', data.userId, 'studentUserName', data.studentUserName, 'error', error])
      reply(error)
    } else {
      let chunks = []
      let totallength = 0

      docx.on('data', function (chunk) {
        chunks.push(chunk)
        totallength += chunk.length
      })

      docx.on('end', function () {
        let results = Buffer.alloc(totallength)
        let pos = 0
        for (var i = 0; i < chunks.length; i++) {
          chunks[i].copy(results, pos)
          pos += chunks[i].length
        }
        logger('info', ['notes', 'generatePreview', 'userId', data.userId, 'studentUserName', data.studentUserName, 'preview generated'])
        reply(results.toString('base64'))
      })
    }
  })
}

module.exports.submit = async (request, reply) => {
  const yar = request.yar
  const user = request.auth.credentials.data
  let data = request.payload
  data.userId = user.userId
  data.userName = user.userName
  data.userAgent = request.headers['user-agent']
  let postData = prepareDocument(data)
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
    reply.redirect('/')
  } catch (error) {
    logger('error', ['notes', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, error])
    yar.set('documentAdded', false)
    reply.redirect('/')
  }
}
