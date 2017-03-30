'use strict'

const axios = require('axios')
const config = require('../config')
const generateSystemJwt = require('../lib/generate-system-jwt')
const createViewOptions = require('../lib/create-view-options')

module.exports.getFrontpage = async (request, reply) => {
  const yar = request.yar
  const warningAdded = yar.get('warningAdded')
  const followupAdded = yar.get('followupAdded')
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.LOGS_SERVICE_URL}/logs/search`
  const myContactClasses = yar.get('myContactClasses') || []
  let mongoQuery = {'userId': userId}

  if (myContactClasses.length > 0) {
    const classIds = myContactClasses.map(item => item.Id)
    mongoQuery = {'$or': [{'userId': userId}, {'studentMainGroupName': {'$in': classIds}}]}
  }

  let viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, latestIdWarnings: warningAdded ? 'Ok' : '', latestIdFollowups: followupAdded ? 'Ok' : '' })

  yar.set('warningAdded', false)
  yar.set('followupAdded', false)

  axios.defaults.headers.common['Authorization'] = token
  axios.post(url, mongoQuery).then(results => {
    viewOptions.logs = results.data || []
    reply.view('index', viewOptions)
  }).catch(error => {
    console.error(error)
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
  if (request.query.studentId) {
    mongoQuery.studentId = request.query.studentId
  } else {
    if (myContactClasses.length > 0) {
      const classIds = myContactClasses.map(item => item.Id)
      mongoQuery = {'$or': [{'userId': userId}, {'studentMainGroupName': {'$in': classIds}}]}
    } else {
      mongoQuery.userId = userId
    }
  }

  axios.defaults.headers.common['Authorization'] = token
  const results = documentId ? await axios.get(url) : await axios.post(url, mongoQuery)

  let viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, logs: results.data })

  if (request.query.studentId || documentId) {
    const doc = results.data[0]
    const isValid = (userId === doc.userId || myContactClasses.map(line => line.Id).includes(doc.studentMainGroupName))
    if (!isValid) {
      viewOptions.logs = []
    }
    reply.view('logs-detailed', viewOptions)
  } else {
    reply.view('logs', viewOptions)
  }
}

module.exports.getHelppage = (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses })

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

  let viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, searchText: searchText })

  axios.defaults.headers.common['Authorization'] = token
  const results = await axios.get(url)
  const payload = results.data

  if (!payload.statusKode) {
    viewOptions.students = payload
    reply.view('search-results', viewOptions)
  }
  if (payload.statusKode === 404) {
    viewOptions.students = []
    reply.view('search-results', viewOptions)
  }
  if (payload.statusKode === 401) {
    reply.redirect('/logout')
  }
}
