'use strict'

const fs = require('fs')
const axios = require('axios')
const brreg = require('brreg')
const getDocumentTemplatesPath = require('tfk-saksbehandling-minelev-templates')
const FormData = require('form-data')
const config = require('../config')
const prepareDocument = require('../lib/prepare-document')
const prepareDocumentPreview = require('../lib/prepare-document-preview')
const generateSystemJwt = require('../lib/generate-system-jwt')
const createViewOptions = require('../lib/create-view-options')
const searchLogs = require('../lib/search-logs')
const datePadding = require('../lib/date-padding')
const getTemplateType = require('../lib/get-template-type')
const logger = require('../lib/logger')
const yffData = require('../lib/data/yff.json')

module.exports.frontPage = async (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentID
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}`
  const urlContactTeachers = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}/contactteachers`
  let mainGroupName = false

  let viewOptions = createViewOptions({credentials: request.auth.credentials, myContactClasses: myContactClasses})

  logger('info', ['yff', 'frontPage', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  axios.defaults.headers.common['Authorization'] = token
  // Retrieves student and students contactTeachers
  const [results, contactTeachersResult] = await Promise.all([axios.get(url), axios.get(urlContactTeachers)])
  const payload = results.data
  const contactTeachers = contactTeachersResult.data
  if (contactTeachers.length > 0) {
    mainGroupName = contactTeachers[0].groupId
    logger('info', ['yff', 'frontPage', 'userId', userId, 'studentUserName', studentUserName, 'mainGroupName', mainGroupName])
  } else {
    logger('error', ['yff', 'frontPage', 'userId', userId, 'studentUserName', studentUserName, 'contactTeachers not found'])
  }
  if (!payload.statusKode) {
    let student = payload[0]
    student.mainGroupName = mainGroupName
    viewOptions.student = student

    logger('info', ['yff', 'frontPage', 'userId', userId, 'studentUserName', studentUserName, 'student data retrieved'])
    if (mainGroupName !== false) {
      reply.view('yff', viewOptions)
    } else {
      reply.view('error-missing-contact-teacher', viewOptions)
    }
  }
  if (payload.statusKode === 401) {
    logger('info', ['yff', 'frontPages', 'userId', userId, 'studentUserName', studentUserName, '401'])
    reply.redirect('/signout')
  }
}

module.exports.information = async (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentID
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}`
  const urlContactTeachers = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}/contactteachers`
  let mainGroupName = false

  let viewOptions = createViewOptions({credentials: request.auth.credentials, myContactClasses: myContactClasses})

  logger('info', ['yff', 'contract', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  axios.defaults.headers.common['Authorization'] = token
  // Retrieves student and students contactTeachers
  const [results, contactTeachersResult] = await Promise.all([axios.get(url), axios.get(urlContactTeachers)])
  const payload = results.data
  const contactTeachers = contactTeachersResult.data
  if (contactTeachers.length > 0) {
    mainGroupName = contactTeachers[0].groupId
    logger('info', ['yff', 'contract', 'userId', userId, 'studentUserName', studentUserName, 'mainGroupName', mainGroupName])
  } else {
    logger('error', ['yff', 'contract', 'userId', userId, 'studentUserName', studentUserName, 'contactTeachers not found'])
  }
  if (!payload.statusKode) {
    let student = payload[0]
    const today = new Date()
    student.mainGroupName = mainGroupName
    viewOptions.student = student
    viewOptions.skjemaUtfyllingStart = today.getTime()
    viewOptions.thisDay = `${today.getFullYear()}-${datePadding(today.getMonth() + 1)}-${datePadding(today.getDate())}`

    logger('info', ['yff', 'contract', 'userId', userId, 'studentUserName', studentUserName, 'student data retrieved'])
    if (mainGroupName !== false) {
      reply.view('yff-information', viewOptions)
    } else {
      reply.view('error-missing-contact-teacher', viewOptions)
    }
  }
  if (payload.statusKode === 401) {
    logger('info', ['yff', 'contract', 'userId', userId, 'studentUserName', studentUserName, '401'])
    reply.redirect('/signout')
  }
}

module.exports.plan = async (request, reply) => {
  const utdanningsprogrammer = require('../lib/data/utdanningsprogrammer.json')
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentID
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}`
  const urlContactTeachers = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}/contactteachers`
  const bedriftsOptions = {
    userId: userId,
    token: token,
    query: {
      documentCategory: 'yff-yff-informasjonsskriv',
      studentUserName: studentUserName
    }
  }
  let mainGroupName = false

  let viewOptions = createViewOptions({
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses,
    utdanningsprogrammer: utdanningsprogrammer
  })

  logger('info', ['yff', 'plan', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  axios.defaults.headers.common['Authorization'] = token
  // Retrieves student, students contactTeachers and bedrift
  const [results, contactTeachersResult, bedrifter] = await Promise.all([axios.get(url), axios.get(urlContactTeachers), searchLogs(bedriftsOptions)])
  const payload = results.data
  const contactTeachers = contactTeachersResult.data
  if (contactTeachers.length > 0) {
    mainGroupName = contactTeachers[0].groupId
    logger('info', ['yff', 'plan', 'userId', userId, 'studentUserName', studentUserName, 'mainGroupName', mainGroupName])
  } else {
    logger('error', ['yff', 'plan', 'userId', userId, 'studentUserName', studentUserName, 'contactTeachers not found'])
  }
  if (!payload.statusKode) {
    let student = payload[0]
    const today = new Date()
    student.mainGroupName = mainGroupName
    viewOptions.student = student
    viewOptions.skjemaUtfyllingStart = today.getTime()
    viewOptions.thisDay = `${today.getFullYear()}-${datePadding(today.getMonth() + 1)}-${datePadding(today.getDate())}`
    viewOptions.bedrifter = bedrifter
    // If not bedrifter remove bedrifter from utplasseringssted
    viewOptions.utplasseringsSted = bedrifter.length > 0 ? yffData.utplasseringsSted : yffData.utplasseringsSted.slice(1)

    logger('info', ['yff', 'plan', 'userId', userId, 'studentUserName', studentUserName, 'student data retrieved'])
    if (mainGroupName !== false) {
      reply.view('yff-plan', viewOptions)
    } else {
      reply.view('error-missing-contact-teacher', viewOptions)
    }
  }
  if (payload.statusKode === 401) {
    logger('info', ['yff', 'plan', 'userId', userId, 'studentUserName', studentUserName, '401'])
    reply.redirect('/signout')
  }
}

module.exports.evaluation = async (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentID
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const evaluationPeriods = require('../lib/data/dummy-evaluation.json')
  const url = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}`
  const urlContactTeachers = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}/contactteachers`
  let mainGroupName = false

  let viewOptions = createViewOptions({credentials: request.auth.credentials, myContactClasses: myContactClasses})

  logger('info', ['yff', 'evaluation', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  axios.defaults.headers.common['Authorization'] = token
  // Retrieves student and students contactTeachers
  const [results, contactTeachersResult] = await Promise.all([axios.get(url), axios.get(urlContactTeachers)])
  const payload = results.data
  const contactTeachers = contactTeachersResult.data
  if (contactTeachers.length > 0) {
    mainGroupName = contactTeachers[0].groupId
    logger('info', ['yff', 'evaluation', 'userId', userId, 'studentUserName', studentUserName, 'mainGroupName', mainGroupName])
  } else {
    logger('error', ['yff', 'evaluation', 'userId', userId, 'studentUserName', studentUserName, 'contactTeachers not found'])
  }
  if (!payload.statusKode) {
    let student = payload[0]
    const today = new Date()
    student.mainGroupName = mainGroupName
    viewOptions.student = student
    viewOptions.skjemaUtfyllingStart = today.getTime()
    viewOptions.thisDay = `${today.getFullYear()}-${datePadding(today.getMonth() + 1)}-${datePadding(today.getDate())}`
    viewOptions.evaluationScores = yffData.evaluation
    viewOptions.competenseScores = yffData.competense
    viewOptions.evaluationPeriods = evaluationPeriods

    logger('info', ['yff', 'plan', 'userId', userId, 'studentUserName', studentUserName, 'student data retrieved'])
    if (mainGroupName !== false) {
      reply.view('yff-evaluation', viewOptions)
    } else {
      reply.view('error-missing-contact-teacher', viewOptions)
    }
  }
  if (payload.statusKode === 401) {
    logger('info', ['yff', 'evaluation', 'userId', userId, 'studentUserName', studentUserName, '401'])
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
  const template = getDocumentTemplatesPath(getTemplateType(postData))
  let templaterForm = new FormData()

  logger('info', ['yff', 'generatePreview', 'userId', data.userId, 'studentUserName', data.studentUserName, 'start'])

  Object.keys(previewData).forEach(key => {
    templaterForm.append(key, previewData[key])
  })

  templaterForm.append('file', fs.createReadStream(template))

  templaterForm.submit(config.PDF_SERVICE_URL, (error, docx) => {
    if (error) {
      logger('error', ['yff', 'generatePreview', 'userId', data.userId, 'studentUserName', data.studentUserName, 'error', error])
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
        logger('info', ['yff', 'generatePreview', 'userId', data.userId, 'studentUserName', data.studentUserName, 'preview generated'])
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

  logger('info', ['yff', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, 'start'])

  axios.put(url, postData)
    .then(results => {
      logger('info', ['yff', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, 'submitted'])
      yar.set('documentAdded', true)
      reply.redirect('/')
    }).catch(error => {
      logger('error', ['yff', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, error])
      yar.set('documentAdded', false)
      reply.redirect('/')
    })
}

module.exports.addLineToPlan = async (request, reply) => {
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
      status: 'Registrert'
    }
  ]

  axios.defaults.headers.common['Authorization'] = token

  logger('info', ['yff', 'addLineToPlan', 'userId', data.userId, 'studentUserName', data.studentUserName, 'start'])

  axios.put(url, postData)
    .then(results => {
      logger('info', ['yff', 'addLineToPlan', 'userId', data.userId, 'studentUserName', data.studentUserName, 'added'])
      reply.redirect(`/yff/plan/${data.studentUserName}`)
    }).catch(error => {
      logger('error', ['yff', 'addLineToPlan', 'userId', data.userId, 'studentUserName', data.studentUserName, error])
      reply.redirect('/')
    })
}

module.exports.lookupBrreg = async (request, reply) => {
  let data = request.payload
  const query = data.query

  logger('info', ['yff', 'lookupBrreg', 'query', query, 'start'])

  const lookup = await brreg({query: query, format: 'json'})
  let results = []
  if (lookup.enhetsregisteret.error === false && lookup.underenheter.error === false) {
    results = lookup.enhetsregisteret.data.entries.concat(lookup.underenheter.data.entries)
  } else if (lookup.enhetsregisteret.error !== false && lookup.underenheter.error === false) {
    results = lookup.underenheter.data.entries
  } else if (lookup.enhetsregisteret.error === false && lookup.underenheter.error !== false) {
    results = lookup.enhetsregisteret.data.entries
  }
  reply(results)
}
