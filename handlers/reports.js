'use strict'

const axios = require('axios')
const config = require('../config')
const generateSystemJwt = require('../lib/generate-system-jwt')
const repackClassReport = require('../lib/repack-class-report')
const createViewOptions = require('../lib/create-view-options')
const logger = require('../lib/logger')

module.exports.getWarningsClassReport = async (request, reply) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const classId = request.params.groupID
  const token = generateSystemJwt(userId)
  const url = `${config.LOGS_SERVICE_URL}/logs/search`
  const myContactClasses = yar.get('myContactClasses') || []
  const query = {
    studentMainGroupName: classId,
    documentType: 'varsel'
  }

  axios.defaults.headers.common['Authorization'] = token

  logger('info', ['reports', 'getWarningsClassReport', 'class', classId, 'user', userId])
  const results = await axios.post(url, query)

  const report = myContactClasses.map(line => line.Id).includes(classId) ? repackClassReport(results.data) : []

  const viewOptions = createViewOptions({credentials: request.auth.credentials, myContactClasses: myContactClasses, report: report, classId: classId})

  reply.view('report-class-warnings', viewOptions)
}

module.exports.getFollowupsClassReport = async (request, reply) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const classId = request.params.groupID
  const token = generateSystemJwt(userId)
  const url = `${config.LOGS_SERVICE_URL}/logs/search`
  const myContactClasses = yar.get('myContactClasses') || []
  const query = {
    studentMainGroupName: classId,
    documentType: 'samtale'
  }

  logger('info', ['reports', 'getFollowupsClassReport', 'class', classId, 'user', userId])

  axios.defaults.headers.common['Authorization'] = token

  const results = await axios.post(url, query)

  const report = myContactClasses.map(line => line.Id).includes(classId) ? repackClassReport(results.data) : []

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, report: report })

  reply.view('report-class-followups', viewOptions)
}
