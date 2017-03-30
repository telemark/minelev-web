'use strict'

const fs = require('fs')
const axios = require('axios')
const getWarningTemplatesPath = require('tfk-saksbehandling-elev-varsel-templates')
const FormData = require('form-data')
const config = require('../config')
const prepareFollowup = require('../lib/prepare-followup')
const prepareFollowupPreview = require('../lib/prepare-followup-preview')
const warnings = require('../lib/data/warnings.json')
const courseCategory = warnings.courses
const order = warnings.order
const behaviour = warnings.behaviour
const warningTypes = warnings.categories
const generateSystemJwt = require('../lib/generate-system-jwt')
const createViewOptions = require('../lib/create-view-options')

function filterWarningTypes (contactTeacher) {
  let filteredList = []
  warningTypes.forEach(type => {
    if (type.id === 'fag' || contactTeacher) {
      filteredList.push(type)
    }
  })
  return filteredList
}

module.exports.writeFollowup = async (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentID
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}`

  let viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, order: order, behaviour: behaviour, courseCategory: courseCategory })

  axios.defaults.headers.common['Authorization'] = token
  const results = await axios.get(url)
  const payload = results.data

  if (!payload.statusKode) {
    const student = payload[0]
    viewOptions.student = student
    viewOptions.warningTypes = filterWarningTypes(student.contactTeacher)
    viewOptions.skjemaUtfyllingStart = new Date().getTime()
    reply.view('followup', viewOptions)
  }
  if (payload.statusKode === 401) {
    console.log(JSON.stringify(payload))
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

  Object.keys(previewData).forEach(key => {
    templaterForm.append(key, previewData[key])
  })

  templaterForm.append('file', fs.createReadStream(template))

  templaterForm.submit(config.PDF_SERVICE_URL, (error, docx) => {
    if (error) {
      reply(error)
    } else {
      let chunks = []
      let totallength = 0

      docx.on('data', function (chunk) {
        chunks.push(chunk)
        totallength += chunk.length
      })

      docx.on('end', function () {
        let results = new Buffer(totallength)
        let pos = 0
        for (var i = 0; i < chunks.length; i++) {
          chunks[i].copy(results, pos)
          pos += chunks[i].length
        }
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

  axios.put(url, postData)
    .then(results => {
      yar.set('followupAdded', true)
      reply.redirect('/')
    }).catch(error => {
      console.error(error)
      yar.set('followupAdded', false)
      reply.redirect('/')
    })
}