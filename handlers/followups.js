'use strict'

const fs = require('fs')
const axios = require('axios')
const getWarningTemplatesPath = require('tfk-saksbehandling-minelev-templates')
const FormData = require('form-data')
const config = require('../config')
const prepareFollowup = require('../lib/prepare-followup')
const prepareFollowupPreview = require('../lib/prepare-followup-preview')
const followups = require('../lib/data/followups.json')
const utvikling = followups.utvikling
const undervegs = followups.undervegs
const annen = followups.annen
const types = followups.types
const generateSystemJwt = require('../lib/generate-system-jwt')
const createViewOptions = require('../lib/create-view-options')
const datePadding = require('../lib/date-padding')
const logger = require('../lib/logger')

module.exports.writeFollowup = async (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentID
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}`

  let viewOptions = createViewOptions({credentials: request.auth.credentials, myContactClasses: myContactClasses, annen: annen, utvikling: utvikling, undervegs: undervegs})

  axios.defaults.headers.common['Authorization'] = token

  logger('info', ['followups', 'writeFollowup', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  const results = await axios.get(url)
  const payload = results.data

  if (!payload.statusKode) {
    const student = payload[0]
    const today = new Date()
    viewOptions.student = student
    viewOptions.types = types
    viewOptions.skjemaUtfyllingStart = today.getTime()
    viewOptions.thisDay = `${today.getFullYear()}-${datePadding(today.getMonth() + 1)}-${datePadding(today.getDate())}`

    logger('info', ['followups', 'writeFollowup', 'userId', userId, 'studentUserName', studentUserName, 'student data retrieved'])

    reply.view('followup', viewOptions)
  }
  if (payload.statusKode === 401) {
    logger('info', ['followups', 'writeFollowup', 'userId', userId, 'studentUserName', studentUserName, '401'])
    reply.redirect('/logout')
  }
}

module.exports.generateFollowupPreview = (request, reply) => {
  const user = request.auth.credentials.data
  let data = request.payload
  data.studentId = request.params.studentID
  data.userId = user.userId
  data.userName = user.userName
  data.userAgent = request.headers['user-agent']
  const postData = prepareFollowup(data)
  const previewData = prepareFollowupPreview(postData)
  const template = getWarningTemplatesPath(postData.documentCategory)
  let templaterForm = new FormData()

  logger('info', ['followups', 'generateFollowupPreview', 'userId', data.userId, 'studentUserName', data.studentUserName, 'start'])

  Object.keys(previewData).forEach(key => {
    templaterForm.append(key, previewData[key])
  })

  templaterForm.append('file', fs.createReadStream(template))

  templaterForm.submit(config.PDF_SERVICE_URL, (error, docx) => {
    if (error) {
      logger('error', ['followups', 'generateFollowupPreview', 'userId', data.userId, 'studentUserName', data.studentUserName, 'error', error])
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
        logger('info', ['followups', 'generateFollowupPreview', 'userId', data.userId, 'studentUserName', data.studentUserName, 'preview generated'])
        reply(results.toString('base64'))
      })
    }
  })
}

module.exports.submitFollowup = async (request, reply) => {
  const yar = request.yar
  const user = request.auth.credentials.data
  const token = generateSystemJwt(user.userId)
  const url = `${config.QUEUE_SERVICE_URL}`
  let data = request.payload
  data.studentId = request.params.studentID
  data.userId = user.userId
  data.userName = user.userName
  data.userAgent = request.headers['user-agent']
  let postData = prepareFollowup(data)

  postData.documentStatus = [
    {
      timeStamp: new Date().getTime(),
      status: 'I kø'
    }
  ]

  axios.defaults.headers.common['Authorization'] = token

  logger('info', ['followups', 'submitFollowup', 'userId', data.userId, 'studentUserName', data.studentUserName, 'start'])

  axios.put(url, postData)
    .then(results => {
      logger('info', ['followups', 'submitFollowup', 'userId', data.userId, 'studentUserName', data.studentUserName, 'submitted'])
      yar.set('followupAdded', true)
      reply.redirect('/')
    }).catch(error => {
      logger('error', ['followups', 'submitFollowup', 'userId', data.userId, 'studentUserName', data.studentUserName, error])
      yar.set('followupAdded', false)
      reply.redirect('/')
    })
}
