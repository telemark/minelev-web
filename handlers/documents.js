'use strict'

const fs = require('fs')
const axios = require('axios')
const getDocumentTemplatesPath = require('tfk-saksbehandling-minelev-templates')
const FormData = require('form-data')
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
const datePadding = require('../lib/date-padding')
const logger = require('../lib/logger')

function filterDocumentTypes (contactTeacher) {
  let filteredList = []
  documentTypes.forEach(type => {
    if (type.id === 'fag' || contactTeacher) {
      filteredList.push(type)
    }
  })
  return filteredList
}

module.exports.write = async (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentID
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}`

  let viewOptions = createViewOptions({credentials: request.auth.credentials, myContactClasses: myContactClasses, order: order, behaviour: behaviour, courseCategory: courseCategory, samtale: samtale, documentTypes: documentTypes, warningPeriods: warningPeriods})

  logger('info', ['documents', 'write', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  axios.defaults.headers.common['Authorization'] = token
  const results = await axios.get(url)
  const payload = results.data

  if (!payload.statusKode) {
    const student = payload[0]
    const today = new Date()
    viewOptions.student = student
    viewOptions.warningTypes = filterDocumentTypes(student.contactTeacher)
    viewOptions.skjemaUtfyllingStart = today.getTime()
    viewOptions.thisDay = `${today.getFullYear()}-${datePadding(today.getMonth() + 1)}-${datePadding(today.getDate())}`

    logger('info', ['documents', 'write', 'userId', userId, 'studentUserName', studentUserName, 'student data retrieved'])

    reply.view('document', viewOptions)
  }
  if (payload.statusKode === 401) {
    logger('info', ['documents', 'write', 'userId', userId, 'studentUserName', studentUserName, '401'])
    reply.redirect('/signout')
  }
}

module.exports.generatePreview = (request, reply) => {
  const user = request.auth.credentials.data
  let data = request.payload
  data.studentId = request.params.studentID
  data.userId = user.userId
  data.userName = user.userName
  data.userAgent = request.headers['user-agent']
  const postData = prepareDocument(data)
  const previewData = prepareDocumentPreview(postData)
  const template = getDocumentTemplatesPath(postData.documentCategory)
  let templaterForm = new FormData()

  logger('info', ['documents', 'generatePreview', 'userId', data.userId, 'studentUserName', data.studentUserName, 'start'])

  Object.keys(previewData).forEach(key => {
    templaterForm.append(key, previewData[key])
  })

  templaterForm.append('file', fs.createReadStream(template))

  templaterForm.submit(config.PDF_SERVICE_URL, (error, docx) => {
    if (error) {
      logger('error', ['documents', 'generatePreview', 'userId', data.userId, 'studentUserName', data.studentUserName, 'error', error])
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
        logger('info', ['documents', 'generatePreview', 'userId', data.userId, 'studentUserName', data.studentUserName, 'preview generated'])
        reply(results.toString('base64'))
      })
    }
  })
}

module.exports.submit = async (request, reply) => {
  const yar = request.yar
  const user = request.auth.credentials.data
  const token = generateSystemJwt(user.userId)
  const url = `${config.QUEUE_SERVICE_URL}`
  let data = request.payload
  data.studentId = request.params.studentID
  data.userId = user.userId
  data.userName = user.userName
  data.userAgent = request.headers['user-agent']
  let postData = prepareDocument(data)

  postData.documentStatus = [
    {
      timeStamp: new Date().getTime(),
      status: 'I kø'
    }
  ]

  axios.defaults.headers.common['Authorization'] = token

  logger('info', ['documents', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, 'start'])

  axios.put(url, postData)
    .then(results => {
      logger('info', ['documents', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, 'submitted'])
      yar.set('documentAdded', true)
      reply.redirect('/')
    }).catch(error => {
      logger('error', ['documents', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, error])
      yar.set('documentAdded', false)
      reply.redirect('/')
    })
}
