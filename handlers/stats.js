'use strict'

const axios = require('axios')
const config = require('../config')
const generateSystemJwt = require('../lib/generate-system-jwt')
const repackStats = require('../lib/repack-stats')
const createViewOptions = require('../lib/create-view-options')
const logger = require('../lib/logger')

module.exports.getStats = async (request, reply) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const urlTotalVarsel = `${config.LOGS_SERVICE_URL}/stats/total/varsel`
  const urlTotalSamtale = `${config.LOGS_SERVICE_URL}/stats/total/samtale`
  const urlSchoolsVarsel = `${config.LOGS_SERVICE_URL}/stats/schools/varsel`
  const urlSchoolsSamtale = `${config.LOGS_SERVICE_URL}/stats/schools/samtale`
  const urlCategories = `${config.LOGS_SERVICE_URL}/stats/categories`
  const myContactClasses = yar.get('myContactClasses') || []

  logger('info', ['stats', 'getStats', 'user', userId])

  axios.defaults.headers.common['Authorization'] = token

  const [totalVarsel, totalSamtale, schoolsVarsel, schoolsSamtale, categories] = await Promise.all([axios.get(urlTotalVarsel), axios.get(urlTotalSamtale), axios.get(urlSchoolsVarsel), axios.get(urlSchoolsSamtale), axios.get(urlCategories)])

  const stats = repackStats({totalVarsel: totalVarsel.data, totalSamtale: totalSamtale.data, schoolsVarsel: schoolsVarsel.data, schoolsSamtale: schoolsSamtale.data, categories: categories.data})

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, stats: stats })

  reply.view('statistikk', viewOptions)
}
