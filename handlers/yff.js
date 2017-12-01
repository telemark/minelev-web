'use strict'

const fs = require('fs')
const axios = require('axios')
const brreg = require('brreg')
const getDocumentTemplatesPath = require('tfk-saksbehandling-minelev-templates')
const FormData = require('form-data')
const schoolsInfo = require('tfk-schools-info')
const arrify = require('arrify')
const config = require('../config')
const prepareDocument = require('../lib/prepare-document')
const prepareYffDocumentPreview = require('../lib/prepare-yff-document-preview')
const prepareYffDocument = require('../lib/prepare-yff-document')
const generateSystemJwt = require('../lib/generate-system-jwt')
const createViewOptions = require('../lib/create-view-options')
const searchLogs = require('../lib/search-logs')
const getProfilePicture = require('../lib/get-profile-picture')
const datePadding = require('../lib/date-padding')
const getTemplateType = require('../lib/get-template-type')
const getClassLevel = require('../lib/get-class-level')
const logger = require('../lib/logger')
const yffData = require('../lib/data/yff.json')

const classLevels = [
  {id: 'VG1', value: 'VG1', description: 'VG1', checked: ''},
  {id: 'VG2', value: 'VG2', description: 'VG2', checked: ''}
]

module.exports.frontPage = async (request, reply) => {
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
      documentCategory: 'yff-informasjonsskriv',
      studentUserName: studentUserName
    }
  }
  const maalOptions = {
    userId: userId,
    token: token,
    query: {
      documentCategory: 'yff-lokalplan-maal',
      studentUserName: studentUserName
    }
  }
  const tilbakemeldingsOptions = {
    userId: userId,
    token: token,
    query: {
      documentCategory: 'yff-tilbakemelding',
      studentUserName: studentUserName
    }
  }
  let mainGroupName = false
  let viewOptions = createViewOptions({credentials: request.auth.credentials, myContactClasses: myContactClasses})

  logger('info', ['yff', 'frontPage', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  axios.defaults.headers.common['Authorization'] = token
  const [results, contactTeachersResult, maal, bedrifter, tilbakemeldinger, profilePicture] = await Promise.all([axios.get(url), axios.get(urlContactTeachers), searchLogs(maalOptions), searchLogs(bedriftsOptions), searchLogs(tilbakemeldingsOptions), getProfilePicture(studentUserName)])
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
    viewOptions.bedrifter = bedrifter
    viewOptions.maal = maal
    viewOptions.tilbakemeldinger = tilbakemeldinger
    if (profilePicture !== false) {
      logger('info', ['yff', 'frontPage', 'userId', userId, 'studentUserName', studentUserName, 'retrieved profile picture'])
      viewOptions.profilePicture = profilePicture.data
    }
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
  const urlUtdanningsProgrammer = `${config.YFF_SERVICE_URL}/utdanningsprogrammer`
  let mainGroupName = false

  let viewOptions = createViewOptions({credentials: request.auth.credentials, myContactClasses: myContactClasses})

  logger('info', ['yff', 'contract', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  axios.defaults.headers.common['Authorization'] = token
  // Retrieves student and students contactTeachers
  const [results, contactTeachersResult, profilePicture, utdanningsProgrammer] = await Promise.all([axios.get(url), axios.get(urlContactTeachers), getProfilePicture(studentUserName), axios.get(urlUtdanningsProgrammer)])
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
    viewOptions.utdanningsProgrammer = utdanningsProgrammer.data
    if (profilePicture !== false) {
      viewOptions.profilePicture = profilePicture.data
    }

    logger('info', ['yff', 'contract', 'userId', userId, 'studentUserName', studentUserName, 'student data retrieved'])
    if (mainGroupName !== false) {
      const classLevel = getClassLevel(mainGroupName)
      viewOptions.classLevels = classLevels.map(thisClass => thisClass.id === classLevel ? Object.assign(thisClass, {checked: 'checked'}) : thisClass)
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

module.exports.maal = async (request, reply) => {
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
      documentCategory: 'yff-informasjonsskriv',
      studentUserName: studentUserName
    }
  }
  const maalOptions = {
    userId: userId,
    token: token,
    query: {
      documentCategory: 'yff-lokalplan-maal',
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
  // Retrieves student, students contactTeachers, bedrift and maal
  const [results, contactTeachersResult, bedrifter, maal, profilePicture] = await Promise.all([axios.get(url), axios.get(urlContactTeachers), searchLogs(bedriftsOptions), searchLogs(maalOptions), getProfilePicture(studentUserName)])
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
    viewOptions.schools = schoolsInfo()
    viewOptions.maal = maal
    viewOptions.bedrifter = bedrifter
    // If not bedrifter remove bedrifter from utplasseringssted
    viewOptions.utplasseringsSted = bedrifter.length > 0 ? yffData.utplasseringsSted : yffData.utplasseringsSted.slice(1)
    if (profilePicture !== false) {
      logger('info', ['yff', 'plan', 'userId', userId, 'studentUserName', studentUserName, 'retrieved profile picture'])
      viewOptions.profilePicture = profilePicture.data
    }

    logger('info', ['yff', 'plan', 'userId', userId, 'studentUserName', studentUserName, 'student data retrieved'])
    if (mainGroupName !== false) {
      const classLevel = getClassLevel(mainGroupName)
      viewOptions.classLevels = classLevels.map(thisClass => thisClass.id === classLevel ? Object.assign(thisClass, {checked: 'checked'}) : thisClass)
      reply.view('yff-maal', viewOptions)
    } else {
      reply.view('error-missing-contact-teacher', viewOptions)
    }
  }
  if (payload.statusKode === 401) {
    logger('info', ['yff', 'plan', 'userId', userId, 'studentUserName', studentUserName, '401'])
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
      documentCategory: 'yff-informasjonsskriv',
      studentUserName: studentUserName
    }
  }
  const maalOptions = {
    userId: userId,
    token: token,
    query: {
      documentCategory: 'yff-lokalplan-maal',
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
  // Retrieves student, students contactTeachers, bedrift and maal
  const [results, contactTeachersResult, bedrifter, maal, profilePicture] = await Promise.all([axios.get(url), axios.get(urlContactTeachers), searchLogs(bedriftsOptions), searchLogs(maalOptions), getProfilePicture(studentUserName)])
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
    viewOptions.schools = schoolsInfo()
    viewOptions.maal = maal
    viewOptions.classLevel = maal[0].classLevel
    viewOptions.utdanningsprogram = maal[0].utdanningsprogram
    viewOptions.bedrifter = bedrifter
    // If not bedrifter remove bedrifter from utplasseringssted
    viewOptions.utplasseringsSted = bedrifter.length > 0 ? yffData.utplasseringsSted : yffData.utplasseringsSted.slice(1)
    if (profilePicture !== false) {
      logger('info', ['yff', 'plan', 'userId', userId, 'studentUserName', studentUserName, 'retrieved profile picture'])
      viewOptions.profilePicture = profilePicture.data
    }

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
  const utplasseringID = request.params.utplasseringID
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const evaluationPeriods = require('../lib/data/dummy-evaluation.json')
  const url = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}`
  const urlContactTeachers = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}/contactteachers`
  const urlBedrift = `${config.LOGS_SERVICE_URL}/logs/${utplasseringID}`
  const maalOptions = {
    userId: userId,
    token: token,
    query: {
      documentCategory: 'yff-lokalplan-maal',
      studentUserName: studentUserName,
      utplasseringID: utplasseringID
    }
  }

  let mainGroupName = false

  let viewOptions = createViewOptions({credentials: request.auth.credentials, myContactClasses: myContactClasses})

  logger('info', ['yff', 'evaluation', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  axios.defaults.headers.common['Authorization'] = token
  // Retrieves student and students contactTeachers
  const [results, contactTeachersResult, bedrifter, maal, profilePicture] = await Promise.all([axios.get(url), axios.get(urlContactTeachers), axios.get(urlBedrift), searchLogs(maalOptions), getProfilePicture(studentUserName)])
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
    const bedrift = bedrifter.data[0]
    student.mainGroupName = mainGroupName
    viewOptions.student = student
    viewOptions.skjemaUtfyllingStart = today.getTime()
    viewOptions.thisDay = `${today.getFullYear()}-${datePadding(today.getMonth() + 1)}-${datePadding(today.getDate())}`
    viewOptions.evaluationScores = yffData.evaluation
    viewOptions.competenseScores = yffData.competense
    viewOptions.evaluationPeriods = evaluationPeriods
    viewOptions.maal = maal
    viewOptions.bedrift = bedrift
    viewOptions.classLevel = bedrift.classLevel
    viewOptions.utdanningsprogram = bedrift.utdanningsprogram
    if (profilePicture !== false) {
      logger('info', ['yff', 'evaluation', 'userId', userId, 'studentUserName', studentUserName, 'retrieve profile picture'])
      viewOptions.profilePicture = profilePicture.data
    }

    logger('info', ['yff', 'evaluation', 'userId', userId, 'studentUserName', studentUserName, 'student data retrieved'])
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

module.exports.generatePreview = async (request, reply) => {
  const user = request.auth.credentials.data
  let data = request.payload
  data.studentId = request.params.studentID
  data.userId = user.userId
  data.userName = user.userName
  data.userMail = user.email
  data.userAgent = request.headers['user-agent']
  const token = generateSystemJwt(user.userId)
  if (data.type === 'yff-lokalplan') {
    const maalOptions = {
      userId: user.userId,
      token: token,
      query: {
        documentCategory: 'yff-lokalplan-maal',
        studentUserName: data.studentUserName
      }
    }
    data.lokalPlanMaal = await searchLogs(maalOptions)
  }
  const yffData = prepareYffDocument(data)
  const documentData = prepareDocument(data)
  let postData = Object.assign({}, documentData, yffData)
  const previewData = prepareYffDocumentPreview(postData)
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
  data.userMail = user.email
  data.userAgent = request.headers['user-agent']

  if (data.type === 'yff-lokalplan') {
    const maalOptions = {
      userId: user.userId,
      token: token,
      query: {
        documentCategory: 'yff-lokalplan-maal',
        studentUserName: data.studentUserName
      }
    }
    data.lokalPlanMaal = await searchLogs(maalOptions)
  }

  const yffData = prepareYffDocument(data)
  const documentData = prepareDocument(data)
  let postData = Object.assign({}, documentData, yffData)
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
      reply.redirect(`/yff/${data.studentUserName}`)
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
  data.kompetansemaalValg = arrify(data.kompetansemaalvalg)
  data.arbeidsOppgaver = arrify(data.arbeidsoppgaver)

  const documentData = prepareDocument(data)
  const yffData = prepareYffDocument(data)
  let postData = Object.assign({}, documentData, yffData)

  postData.documentStatus = [
    {
      timeStamp: new Date().getTime(),
      status: 'Registrert'
    }
  ]

  postData.isQueued = false

  axios.defaults.headers.common['Authorization'] = token

  const jobs = data.kompetansemaalValg.map((line, index) => axios.put(url, Object.assign({}, postData, {kompetanseMaal: line}, {arbeidsOppgaver: data.arbeidsOppgaver[index]})))

  logger('info', ['yff', 'addLineToPlan', 'userId', data.userId, 'studentUserName', data.studentUserName, 'jobs', jobs.length, 'start'])

  Promise.all(jobs)
    .then(results => {
      logger('info', ['yff', 'addLineToPlan', 'userId', data.userId, 'studentUserName', data.studentUserName, 'added', results.length])
      reply.redirect(`/yff/maal/${data.studentUserName}`)
    }).catch(error => {
      logger('error', ['yff', 'addLineToPlan', 'userId', data.userId, 'studentUserName', data.studentUserName, error])
      reply.redirect('/')
    })
}

module.exports.removeLineFromPlan = async (request, reply) => {
  const user = request.auth.credentials.data
  const token = generateSystemJwt(user.userId)
  const { studentID, maalID } = request.params
  const findUrl = `${config.QUEUE_SERVICE_URL}/${maalID}`
  const deleteUrl = `${config.QUEUE_SERVICE_URL}/${maalID}`

  axios.defaults.headers.common['Authorization'] = token

  logger('info', ['yff', 'removeLineFromPlan', 'userId', user.userId, 'studentUserName', studentID, 'id', maalID, 'start'])

  try {
    const { data } = await axios.get(findUrl)
    if (data.length === 1 && data[0].studentUserName === studentID) {
      axios.delete(deleteUrl)
        .then(result => {
          logger('info', ['yff', 'removeLineFromPlan', 'userId', user.userId, 'studentUserName', studentID, 'id', maalID, 'removed'])
          // reply.redirect(`/yff/plan/${studentID}`)
          reply({success: true})
        })
        .catch(error => {
          logger('info', ['yff', 'removeLineFromPlan', 'userId', user.userId, 'studentUserName', studentID, 'id', maalID, error])
          // reply.redirect(`/yff/plan/${studentID}`)
          reply({success: false})
        })
    } else {
      logger('error', ['yff', 'removeLineFromPlan', 'userId', user.userId, 'studentUserName', studentID, 'id', maalID, 'mismatch in line', maalID])
      // reply.redirect(`/yff/plan/${studentID}`)
      reply({success: false})
    }
  } catch (error) {
    logger('info', ['yff', 'removeLineFromPlan', 'userId', user.userId, 'studentUserName', studentID, 'id', maalID, error])
    reply.redirect(`/yff/plan/${studentID}`)
  }
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
