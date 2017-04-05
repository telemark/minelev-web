'use strict'

const axios = require('axios')
const winston = require('winston')
const config = require('../config')
const generateSystemJwt = require('../lib/generate-system-jwt')
const createViewOptions = require('../lib/create-view-options')

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({timestamp: true})
  ]
})

module.exports.getFrontpage = async (request, reply) => {
  const yar = request.yar
  const warningAdded = yar.get('warningAdded')
  const followupAdded = yar.get('followupAdded')
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.LOGS_SERVICE_URL}/logs/search`
  const myContactClasses = yar.get('myContactClasses') || []
  let mongoQuery = {'userId': userId}

  logger.info('index', 'getFrontpage', 'userId', userId, 'start')

  if (myContactClasses.length > 0) {
    const classIds = myContactClasses.map(item => item.Id)
    mongoQuery = {'$or': [{'userId': userId}, {'studentMainGroupName': {'$in': classIds}}]}
    logger.info('index', 'getFrontpage', 'userId', userId, 'contact teacher', classIds.join(', '))
  }

  let viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, latestIdWarnings: warningAdded ? 'Ok' : '', latestIdFollowups: followupAdded ? 'Ok' : '' })

  yar.set('warningAdded', false)
  yar.set('followupAdded', false)

  axios.defaults.headers.common['Authorization'] = token
  axios.post(url, mongoQuery).then(results => {
    viewOptions.logs = results.data || []
    logger.info('index', 'getFrontpage', 'userId', userId, 'got logs', viewOptions.logs.length)
    reply.view('index', viewOptions)
  }).catch(error => {
    logger.error('index', 'getFrontpage', 'userId', userId, error)
    viewOptions.logs = []
    reply.view('index', viewOptions)
  })
}

module.exports.getLogspage = async (request, reply) => {
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const documentId = request.query.documentId
  const url = documentId ? `${config.LOGS_SERVICE_URL}/logs/${documentId}` : `${config.LOGS_SERVICE_URL}/logs/search`
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  let mongoQuery = {}

  logger.info('index', 'getLogspage', 'userId', userId, 'start')

  if (request.query.studentId) {
    logger.info('index', 'getLogspage', 'userId', userId, 'studentId', request.query.studentId)
    mongoQuery.studentId = request.query.studentId
  } else {
    if (myContactClasses.length > 0) {
      const classIds = myContactClasses.map(item => item.Id)
      logger.info('index', 'getLogspage', 'userId', userId, 'classes', classIds.join(', '))
      mongoQuery = {'$or': [{'userId': userId}, {'studentMainGroupName': {'$in': classIds}}]}
    } else {
      mongoQuery.userId = userId
      logger.info('index', 'getLogspage', 'userId', userId, 'single')
    }
  }

  axios.defaults.headers.common['Authorization'] = token
  const results = documentId ? await axios.get(url) : await axios.post(url, mongoQuery)

  let viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, logs: results.data })

  if (request.query.studentId || documentId) {
    logger.info('index', 'getLogspage', 'userId', userId, 'single log ok')
    const doc = results.data[0]
    const isValid = (userId === doc.userId || myContactClasses.map(line => line.Id).includes(doc.studentMainGroupName))
    if (!isValid) {
      viewOptions.logs = []
    }
    reply.view('logs-detailed', viewOptions)
  } else {
    logger.info('index', 'getLogspage', 'userId', userId, 'multiple logs ok')
    reply.view('logs', viewOptions)
  }
}

module.exports.getHelppage = (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const userId = request.auth.credentials.data.userId
  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses })

  logger.info('index', 'getHelppage', 'userId', userId, 'start')

  reply.view('help', viewOptions)
}

module.exports.doSearch = async (request, reply) => {
  const yar = request.yar
  const data = request.payload
  const searchText = data.searchText
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/students?name=${searchText}`
  const myContactClasses = yar.get('myContactClasses') || []

  logger.info('index', 'doSearch', 'userId', userId, 'searchText', searchText, 'start')

  let viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, searchText: searchText })

  axios.defaults.headers.common['Authorization'] = token
  const results = await axios.get(url)
  const payload = results.data

  if (!payload.statusKode) {
    viewOptions.students = payload
    logger.info('index', 'doSearch', 'userId', userId, 'searchText', searchText, 'success', payload.length, 'hits')
    reply.view('search-results', viewOptions)
  }
  if (payload.statusKode === 404) {
    viewOptions.students = []
    logger.info('index', 'doSearch', 'userId', userId, 'searchText', searchText, '404')
    reply.view('search-results', viewOptions)
  }
  if (payload.statusKode === 401) {
    logger.info('index', 'doSearch', 'userId', userId, 'searchText', searchText, '401')
    reply.redirect('/logout')
  }
}
