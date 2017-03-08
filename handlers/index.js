'use strict'

const fs = require('fs')
const axios = require('axios')
const logger = require('../lib/logger')
const config = require('../config')
const pkg = require('../package.json')

module.exports.getFrontpage = (request, reply) => {
  const yar = request.yar
  // const userId = request.auth.credentials.data.userId
  const myContactClasses = yar.get('myContactClasses') || []

  const viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses,
    latestId: request.query.documentAdded,
    logs: data || []
  }
  reply.view('index', viewOptions)

  /*


  var mongoQuery = {'userId': userId}

  if (myContactClasses.length > 0) {
    const classIds = myContactClasses.map(item => item.Id)
    mongoQuery = {'$or': [{'userId': userId}, {'studentMainGroupName': {'$in': classIds}}]}
  }
  logs.find(mongoQuery).sort({timeStamp: -1}).limit(40, function (error, data) {
    if (error) {
      logger(['getFrontpage', 'error', JSON.stringify(error)])
    }
    const viewOptions = {
      version: pkg.version,
      versionName: pkg.louie.versionName,
      versionVideoUrl: pkg.louie.versionVideoUrl,
      systemName: pkg.louie.systemName,
      githubUrl: pkg.repository.url,
      credentials: request.auth.credentials,
      myContactClasses: myContactClasses,
      latestId: request.query.documentAdded,
      logs: data || []
    }
    reply.view('index', viewOptions)
  })
  */
}

module.exports.getLogspage = (request, reply) => {
  const userId = request.auth.credentials.data.userId
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  var mongoQuery = {}
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

  logs.find(mongoQuery).sort({timeStamp: -1}, function (error, data) {
    if (error) {
      logger(['getLogspage', 'error', JSON.stringify(error)])
    }
    const viewOptions = {
      version: pkg.version,
      versionName: pkg.louie.versionName,
      versionVideoUrl: pkg.louie.versionVideoUrl,
      systemName: pkg.louie.systemName,
      githubUrl: pkg.repository.url,
      credentials: request.auth.credentials,
      myContactClasses: myContactClasses,
      logs: data
    }
    if (request.query.studentId) {
      reply.view('logs-detailed', viewOptions)
    } else {
      reply.view('logs', viewOptions)
    }
  })
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

module.exports.doSearch = (request, reply) => {
  const yar = request.yar
  const data = request.payload
  const searchText = data.searchText
  const userId = request.auth.credentials.data.userId
  const myContactClasses = yar.get('myContactClasses') || []

  var viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses,
    searchText: searchText
  }

  request.seneca.act({role: 'buddy', search: 'students', userId: userId, query: searchText}, (error, payload) => {
    if (error) {
      logger(['doSearch', 'buddy', 'students', 'error', error])
      reply(error)
    } else {
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
  })
}
