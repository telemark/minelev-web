'use strict'

const axios = require('axios')
const config = require('../config')
const pkg = require('../package.json')
const generateSystemJwt = require('../lib/generate-system-jwt')

module.exports.getFrontpage = async (request, reply) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.LOGS_SERVICE_URL}/logs/search`
  const myContactClasses = yar.get('myContactClasses') || []
  let mongoQuery = {'userId': userId}
  if (myContactClasses.length > 0) {
    const classIds = myContactClasses.map(item => item.Id)
    mongoQuery = {'$or': [{'userId': userId}, {'studentMainGroupName': {'$in': classIds}}]}
  }

  axios.defaults.headers.common['Authorization'] = token
  const results = await axios.post(url, mongoQuery)

  const viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses,
    latestId: request.query.documentAdded,
    logs: results.data || []
  }

  reply.view('index', viewOptions)
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

  const viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses,
    logs: results.data
  }
  if (request.query.studentId || documentId) {
    reply.view('logs-detailed', viewOptions)
  } else {
    reply.view('logs', viewOptions)
  }
}

module.exports.getHelppage = (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses
  }
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

  let viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses,
    searchText: searchText
  }

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
