'use strict'

const fs = require('fs')
const axios = require('axios')
const getWarningTemplatesPath = require('tfk-saksbehandling-elev-varsel-templates')
const FormData = require('form-data')
const logger = require('../lib/logger')
const config = require('../config')
const pkg = require('../package.json')
const prepareWarning = require('../lib/prepare-warning')
const prepareWarningPreview = require('../lib/prepare-warning-preview')
const courseCategory = require('../lib/categories-courses')
const order = require('../lib/categories-order')
const behaviour = require('../lib/categories-behaviour')
const warningTypes = require('../lib/categories-warnings')

function filterWarningTypes (contactTeacher) {
  let filteredList = []
  warningTypes.forEach(function (type) {
    if (type.id === 'fag' || contactTeacher) {
      filteredList.push(type)
    }
  })
  return filteredList
}

module.exports.writeWarning = (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentID
  const userId = request.auth.credentials.data.userId
  var viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses,
    order: order,
    behaviour: behaviour,
    courseCategory: courseCategory
  }

  request.seneca.act({role: 'buddy', get: 'student', userId: userId, studentUserName: studentUserName}, (error, payload) => {
    if (error) {
      logger(['writeWarning', 'buddy', 'student', 'error', userId, studentUserName, error])
      reply(error)
    } else {
      if (!payload.statusCode) {
        const student = payload[0]
        viewOptions.student = student
        viewOptions.warningTypes = filterWarningTypes(student.contactTeacher)
        viewOptions.skjemaUtfyllingStart = new Date().getTime()
        reply.view('warning', viewOptions)
      }
      if (payload.statusCode === 401) {
        console.log(JSON.stringify(payload))
        reply.redirect('/logout')
      }
    }
  })
}

module.exports.generateWarningPreview = (request, reply) => {
  var user = request.auth.credentials.data
  var data = request.payload
  data.studentId = request.params.studentID
  data.userId = user.userId
  data.userName = user.cn
  data.userAgent = request.headers['user-agent']
  var postData = prepareWarning(data)
  var previewData = prepareWarningPreview(postData)
  var template = getWarningTemplatesPath(postData.documentCategory)
  var templaterForm = new FormData()

  request.seneca.act({role: 'info', info: 'preview', data: previewData})

  Object.keys(previewData).forEach(function (key) {
    templaterForm.append(key, previewData[key])
  })

  templaterForm.append('file', fs.createReadStream(template))

  templaterForm.submit(config.TEMPLATER_SERVICE_URL, function (error, docx) {
    if (error) {
      logger(['generateWarningPreview', 'error', JSON.stringify(error)])
      reply(error)
    } else {
      var chunks = []
      var totallength = 0

      docx.on('data', function (chunk) {
        chunks.push(chunk)
        totallength += chunk.length
      })

      docx.on('end', function () {
        var results = new Buffer(totallength)
        var pos = 0
        for (var i = 0; i < chunks.length; i++) {
          chunks[i].copy(results, pos)
          pos += chunks[i].length
        }
        reply(results.toString('base64'))
      })
    }
  })
}

module.exports.submitWarning = (request, reply) => {
  const user = request.auth.credentials.data
  var data = request.payload
  data.studentId = request.params.studentID
  data.userId = user.userId
  data.userName = user.cn
  data.userAgent = request.headers['user-agent']
  var postData = prepareWarning(data)

  request.seneca.act({role: 'queue', cmd: 'add', data: postData}, (error, doc) => {
    if (error) {
      logger(['submitWarning', 'queue', 'add', 'error', error])
    } else {
      postData.documentId = doc._id.toString()
      postData.documentStatus = [
        {
          timeStamp: new Date().getTime(),
          status: 'I kø'
        }
      ]
      logs.save(postData)
      reply.redirect('/?documentAdded=' + postData.documentId)
    }
  })
}
