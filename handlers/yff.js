const axios = require('axios')
const brreg = require('brreg')
const getDocumentTemplate = require('document-templates')
const schoolsInfo = require('tfk-schools-info')
const arrify = require('arrify')
const config = require('../config')
const prepareDocument = require('../lib/prepare-document')
const prepareYffDocumentPreview = require('../lib/prepare-yff-document-preview')
const prepareYffDocument = require('../lib/prepare-yff-document')
const generateSystemJwt = require('../lib/generate-system-jwt')
const createViewOptions = require('../lib/create-view-options')
const createPreview = require('../lib/create-preview')
const searchLogs = require('../lib/search-logs')
const getProfilePicture = require('../lib/get-profile-picture')
const datePadding = require('../lib/date-padding')
const getTemplateType = require('../lib/get-template-type')
const getClassLevel = require('../lib/get-class-level')
const logger = require('../lib/logger')
const queueMessage = require('../lib/queue-message')
const yffData = require('../lib/data/yff.json')

const classLevels = [
  { id: 'VG1', value: 'VG1', description: 'vg1', checked: '' },
  { id: 'VG2', value: 'VG2', description: 'vg2', checked: '' }
]

module.exports.frontPage = async (request, h) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentUserName
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}`
  const urlContactTeachers = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}/contactteachers`
  const bedriftsOptions = {
    userId: userId,
    token: token,
    query: {
      documentCategory: 'yff-bekreftelse',
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
  const planOptions = {
    userId: userId,
    token: token,
    query: {
      documentCategory: 'yff-lokalplan',
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
  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses })

  logger('info', ['yff', 'frontPage', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  axios.defaults.headers.common.Authorization = token
  const [results, contactTeachersResult, maal, bedrifter, tilbakemeldinger, planer, profilePicture] = await Promise.all([axios.get(url), axios.get(urlContactTeachers), searchLogs(maalOptions), searchLogs(bedriftsOptions), searchLogs(tilbakemeldingsOptions), searchLogs(planOptions), getProfilePicture(studentUserName)])
  const payload = results.data
  const contactTeachers = contactTeachersResult.data
  if (contactTeachers.length > 0) {
    mainGroupName = contactTeachers[0].groupId
    logger('info', ['yff', 'frontPage', 'userId', userId, 'studentUserName', studentUserName, 'mainGroupName', mainGroupName])
  } else {
    logger('error', ['yff', 'frontPage', 'userId', userId, 'studentUserName', studentUserName, 'contactTeachers not found'])
  }
  if (!payload.statusKode) {
    const student = payload[0]
    student.mainGroupName = mainGroupName
    viewOptions.student = student
    viewOptions.bedrifter = bedrifter
    viewOptions.maal = maal
    viewOptions.planer = planer
    viewOptions.tilbakemeldinger = tilbakemeldinger
    if (profilePicture !== false) {
      logger('info', ['yff', 'frontPage', 'userId', userId, 'studentUserName', studentUserName, 'retrieved profile picture'])
      viewOptions.profilePicture = profilePicture.data
    }
    logger('info', ['yff', 'frontPage', 'userId', userId, 'studentUserName', studentUserName, 'student data retrieved'])
    if (mainGroupName !== false) {
      return h.view('yff', viewOptions)
    } else {
      return h.view('error-missing-contact-teacher', viewOptions)
    }
  }
  if (payload.statusKode === 401) {
    logger('info', ['yff', 'frontPages', 'userId', userId, 'studentUserName', studentUserName, '401'])
    return h.redirect('/signout')
  }
}

module.exports.bekreftelse = async (request, h) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentUserName
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}`
  const urlContactTeachers = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}/contactteachers`
  const urlUtdanningsProgrammer = `${config.YFF_SERVICE_URL}/utdanningsprogrammer`
  let mainGroupName = false

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses })

  logger('info', ['yff', 'bekreftelse', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  axios.defaults.headers.common.Authorization = token
  // Retrieves student and students contactTeachers
  const [results, contactTeachersResult, profilePicture, utdanningsProgrammer] = await Promise.all([axios.get(url), axios.get(urlContactTeachers), getProfilePicture(studentUserName), axios.get(urlUtdanningsProgrammer)])
  const payload = results.data
  const contactTeachers = contactTeachersResult.data
  if (contactTeachers.length > 0) {
    mainGroupName = contactTeachers[0].groupId
    logger('info', ['yff', 'bekreftelse', 'userId', userId, 'studentUserName', studentUserName, 'mainGroupName', mainGroupName])
  } else {
    logger('error', ['yff', 'bekreftelse', 'userId', userId, 'studentUserName', studentUserName, 'contactTeachers not found'])
  }
  if (!payload.statusKode) {
    const student = payload[0]
    const today = new Date()
    student.mainGroupName = mainGroupName
    viewOptions.student = student
    viewOptions.skjemaUtfyllingStart = today.getTime()
    viewOptions.thisDay = `${today.getFullYear()}-${datePadding(today.getMonth() + 1)}-${datePadding(today.getDate())}`
    viewOptions.utdanningsProgrammer = utdanningsProgrammer.data
    if (profilePicture !== false) {
      viewOptions.profilePicture = profilePicture.data
    }

    logger('info', ['yff', 'bekreftelse', 'userId', userId, 'studentUserName', studentUserName, 'student data retrieved'])
    if (mainGroupName !== false) {
      const classLevel = getClassLevel(mainGroupName)
      viewOptions.classLevels = classLevels.map(thisClass => thisClass.id === classLevel ? Object.assign(thisClass, { checked: 'checked' }) : thisClass)
      return h.view('yff-bekreftelse', viewOptions)
    } else {
      return h.view('error-missing-contact-teacher', viewOptions)
    }
  }
  if (payload.statusKode === 401) {
    logger('info', ['yff', 'contract', 'userId', userId, 'studentUserName', studentUserName, '401'])
    return h.redirect('/signout')
  }
}

module.exports.maal = async (request, h) => {
  const utdanningsprogrammer = require('../lib/data/utdanningsprogrammer.json')
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentUserName
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}`
  const urlContactTeachers = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}/contactteachers`
  const bedriftsOptions = {
    userId: userId,
    token: token,
    query: {
      documentCategory: 'yff-bekreftelse',
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

  const viewOptions = createViewOptions({
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses
  })

  logger('info', ['yff', 'maal', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  axios.defaults.headers.common.Authorization = token
  // Retrieves student, students contactTeachers, bedrift and maal
  const [results, contactTeachersResult, bedrifter, maal, profilePicture] = await Promise.all([axios.get(url), axios.get(urlContactTeachers), searchLogs(bedriftsOptions), searchLogs(maalOptions), getProfilePicture(studentUserName)])
  const payload = results.data
  const contactTeachers = contactTeachersResult.data
  if (contactTeachers.length > 0) {
    mainGroupName = contactTeachers[0].groupId
    logger('info', ['yff', 'maal', 'userId', userId, 'studentUserName', studentUserName, 'mainGroupName', mainGroupName])
  } else {
    logger('error', ['yff', 'maal', 'userId', userId, 'studentUserName', studentUserName, 'contactTeachers not found'])
  }
  if (!payload.statusKode) {
    const student = payload[0]
    const today = new Date()
    student.mainGroupName = mainGroupName
    viewOptions.student = student
    viewOptions.skjemaUtfyllingStart = today.getTime()
    viewOptions.thisDay = `${today.getFullYear()}-${datePadding(today.getMonth() + 1)}-${datePadding(today.getDate())}`
    viewOptions.schools = schoolsInfo({ yff: true })
    viewOptions.maal = maal
    viewOptions.bedrifter = bedrifter
    // If not bedrifter remove bedrifter from utplasseringssted
    viewOptions.utplasseringsSted = bedrifter.length > 0 ? yffData.utplasseringsSted : yffData.utplasseringsSted.slice(1)
    if (maal.length > 0) {
      const upName = maal[0].utdanningsprogram
      viewOptions.utdanningsprogrammer = utdanningsprogrammer.map(up => up.name === upName ? Object.assign(up, { selected: 'selected' }) : up)
    } else if (bedrifter.length > 0) {
      const upName = bedrifter[0].utdanningsprogram
      viewOptions.utdanningsprogrammer = utdanningsprogrammer.map(up => up.name === upName ? Object.assign(up, { selected: 'selected' }) : up)
    } else {
      viewOptions.utdanningsprogrammer = utdanningsprogrammer
    }
    if (profilePicture !== false) {
      logger('info', ['yff', 'maal', 'userId', userId, 'studentUserName', studentUserName, 'retrieved profile picture'])
      viewOptions.profilePicture = profilePicture.data
    }

    logger('info', ['yff', 'maal', 'userId', userId, 'studentUserName', studentUserName, 'student data retrieved'])
    if (mainGroupName !== false) {
      const classLevel = getClassLevel(mainGroupName)
      viewOptions.classLevels = classLevels.map(thisClass => thisClass.id === classLevel ? Object.assign(thisClass, { checked: 'checked' }) : thisClass)
      return h.view('yff-maal', viewOptions)
    } else {
      return h.view('error-missing-contact-teacher', viewOptions)
    }
  }
  if (payload.statusKode === 401) {
    logger('info', ['yff', 'maal', 'userId', userId, 'studentUserName', studentUserName, '401'])
    return h.redirect('/signout')
  }
}

module.exports.plan = async (request, h) => {
  const utdanningsprogrammer = require('../lib/data/utdanningsprogrammer.json')
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentUserName
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}`
  const urlContactTeachers = `${config.BUDDY_SERVICE_URL}/students/${studentUserName}/contactteachers`
  const bedriftsOptions = {
    userId: userId,
    token: token,
    query: {
      documentCategory: 'yff-bekreftelse',
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

  const viewOptions = createViewOptions({
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses,
    utdanningsprogrammer: utdanningsprogrammer
  })

  logger('info', ['yff', 'plan', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  axios.defaults.headers.common.Authorization = token
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
    const student = payload[0]
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
      return h.view('yff-plan', viewOptions)
    } else {
      return h.view('error-missing-contact-teacher', viewOptions)
    }
  }
  if (payload.statusKode === 401) {
    logger('info', ['yff', 'plan', 'userId', userId, 'studentUserName', studentUserName, '401'])
    return h.redirect('/signout')
  }
}

module.exports.evaluation = async (request, h) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const studentUserName = request.params.studentUserName
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

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses })

  logger('info', ['yff', 'evaluation', 'userId', userId, 'studentUserName', studentUserName, 'start'])

  axios.defaults.headers.common.Authorization = token
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
    const student = payload[0]
    const today = new Date()
    const bedrift = bedrifter.data[0]
    student.mainGroupName = mainGroupName
    viewOptions.student = student
    viewOptions.skjemaUtfyllingStart = today.getTime()
    viewOptions.thisDay = `${today.getFullYear()}-${datePadding(today.getMonth() + 1)}-${datePadding(today.getDate())}`
    viewOptions.evaluationScores = yffData.evaluation
    viewOptions.competenseScores = yffData.competense
    viewOptions.evaluationPeriods = evaluationPeriods
    viewOptions.evaluationOrder = yffData.order
    viewOptions.maal = maal
    viewOptions.bedrift = bedrift
    if (profilePicture !== false) {
      logger('info', ['yff', 'evaluation', 'userId', userId, 'studentUserName', studentUserName, 'retrieve profile picture'])
      viewOptions.profilePicture = profilePicture.data
    }

    logger('info', ['yff', 'evaluation', 'userId', userId, 'studentUserName', studentUserName, 'student data retrieved'])
    if (mainGroupName !== false) {
      return h.view('yff-evaluation', viewOptions)
    } else {
      return h.view('error-missing-contact-teacher', viewOptions)
    }
  }
  if (payload.statusKode === 401) {
    logger('info', ['yff', 'evaluation', 'userId', userId, 'studentUserName', studentUserName, '401'])
    return h.redirect('/signout')
  }
}

module.exports.generatePreview = async (request, h) => {
  const user = request.auth.credentials.data
  const data = request.payload
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
  const postData = Object.assign({}, documentData, yffData)
  const previewData = prepareYffDocumentPreview(postData)
  const documentTemplate = getDocumentTemplate({ domain: 'minelev', templateId: getTemplateType(postData) })
  const template = documentTemplate.filePath

  logger('info', ['yff', 'generatePreview', 'userId', data.userId, 'studentUserName', data.studentUserName, 'start'])

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
  const postData = Object.assign({}, documentData, yffData)
  postData.documentStatus = [
    {
      timeStamp: new Date().getTime(),
      status: 'I kø'
    }
  ]

  axios.defaults.headers.common.Authorization = token

  logger('info', ['yff', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, postData.documentCategory, 'start'])

  const jobs = [axios.put(url, postData)]

  // adds copy if bekreftelse
  if (postData.documentCategory === 'yff-bekreftelse') {
    logger('info', ['yff', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, 'yff-bekreftelse', 'creates copy'])
    const postDataBedrift = Object.assign({}, postData)
    postDataBedrift.documentCategory = 'yff-bekreftelse-bedrift'
    jobs.push(axios.put(url, postDataBedrift))
    if (config.MESSAGE_QUEUE_CONNECTION_STRING) {
      logger('info', ['yff', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, 'yff-bekreftelse', 'Adds to message queue'])
      jobs.push(queueMessage(postDataBedrift))
    }
  }

  try {
    const results = await Promise.all(jobs)
    logger('info', ['yff', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, 'submitted', results.length])
    yar.set('documentAdded', true)
    return h.redirect(`/yff/${data.studentUserName}`)
  } catch (error) {
    logger('error', ['yff', 'submit', 'userId', data.userId, 'studentUserName', data.studentUserName, error])
    yar.set('documentAdded', false)
    return h.redirect('/')
  }
}

module.exports.addLineToPlan = async (request, h) => {
  const user = request.auth.credentials.data
  const token = generateSystemJwt(user.userId)
  const url = `${config.QUEUE_SERVICE_URL}`
  const data = request.payload
  data.userId = user.userId
  data.userName = user.userName
  data.userAgent = request.headers['user-agent']
  data.kompetansemaalValg = arrify(data.kompetansemaalvalg)
  data.arbeidsOppgaver = arrify(data.arbeidsoppgaver)

  const documentData = prepareDocument(data)
  const yffData = prepareYffDocument(data)
  const postData = Object.assign({}, documentData, yffData)

  postData.documentStatus = [
    {
      timeStamp: new Date().getTime(),
      status: 'Registrert'
    }
  ]

  postData.isQueued = false

  axios.defaults.headers.common.Authorization = token

  const jobs = data.kompetansemaalValg.map((line, index) => axios.put(url, Object.assign({}, postData, { kompetanseMaal: line }, { arbeidsOppgaver: data.arbeidsOppgaver[index] })))

  logger('info', ['yff', 'addLineToPlan', 'userId', data.userId, 'studentUserName', data.studentUserName, 'jobs', jobs.length, 'start'])

  try {
    const results = await Promise.all(jobs)
    logger('info', ['yff', 'addLineToPlan', 'userId', data.userId, 'studentUserName', data.studentUserName, 'added', results.length])
    return h.redirect(`/yff/maal/${data.studentUserName}`)
  } catch (error) {
    logger('error', ['yff', 'addLineToPlan', 'userId', data.userId, 'studentUserName', data.studentUserName, error])
    return h.redirect(`/yff/maal/${data.studentUserName}`)
  }
}

module.exports.removeLineFromPlan = async (request, h) => {
  const user = request.auth.credentials.data
  const token = generateSystemJwt(user.userId)
  const { studentUserName, maalID } = request.params
  const findUrl = `${config.QUEUE_SERVICE_URL}/${maalID}`
  const deleteUrl = `${config.QUEUE_SERVICE_URL}/${maalID}`

  axios.defaults.headers.common.Authorization = token

  logger('info', ['yff', 'removeLineFromPlan', 'userId', user.userId, 'studentUserName', studentUserName, 'id', maalID, 'start'])

  try {
    const { data } = await axios.get(findUrl)
    if (data.length === 1 && data[0].studentUserName === studentUserName) {
      try {
        await axios.delete(deleteUrl)
        logger('info', ['yff', 'removeLineFromPlan', 'userId', user.userId, 'studentUserName', studentUserName, 'id', maalID, 'removed'])
        return { success: true }
      } catch (error) {
        logger('info', ['yff', 'removeLineFromPlan', 'userId', user.userId, 'studentUserName', studentUserName, 'id', maalID, error])
        return { success: false }
      }
    } else {
      logger('error', ['yff', 'removeLineFromPlan', 'userId', user.userId, 'studentUserName', studentUserName, 'id', maalID, 'mismatch in line', maalID])
      return { success: false }
    }
  } catch (error) {
    logger('info', ['yff', 'removeLineFromPlan', 'userId', user.userId, 'studentUserName', studentUserName, 'id', maalID, error])
    return h.redirect(`/yff/plan/${studentUserName}`)
  }
}

module.exports.lookupBrreg = async (request, h) => {
  const data = request.payload
  const query = data.query

  logger('info', ['yff', 'lookupBrreg', 'query', query, 'start'])

  const lookup = await brreg({ query: query, format: 'json' })
  let results = []
  if (lookup.enhetsregisteret.error === false && lookup.underenheter.error === false) {
    results = lookup.enhetsregisteret.data.entries.concat(lookup.underenheter.data.entries)
  } else if (lookup.enhetsregisteret.error !== false && lookup.underenheter.error === false) {
    results = lookup.underenheter.data.entries
  } else if (lookup.enhetsregisteret.error === false && lookup.underenheter.error !== false) {
    results = lookup.enhetsregisteret.data.entries
  }
  return results
}
