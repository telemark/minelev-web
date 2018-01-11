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
  const urlTotalVarsel = `${config.STATS_SERVICE_URL}/stats/total/varsel`
  const urlTotalSamtale = `${config.STATS_SERVICE_URL}/stats/total/samtale`
  const urlTotalBekreftelse = `${config.STATS_SERVICE_URL}/stats/total/yff-bekreftelse`
  const urlTotalTilbakemelding = `${config.STATS_SERVICE_URL}/stats/total/yff-tilbakemelding`
  const urlTotalLokalplan = `${config.STATS_SERVICE_URL}/stats/total/yff-lokalplan`
  const urlSchoolsVarsel = `${config.STATS_SERVICE_URL}/stats/schools/varsel`
  const urlSchoolsSamtale = `${config.STATS_SERVICE_URL}/stats/schools/samtale`
  const urlCategories = `${config.STATS_SERVICE_URL}/stats/categories`
  const myContactClasses = yar.get('myContactClasses') || []

  logger('info', ['stats', 'getStats', 'user', userId])

  axios.defaults.headers.common['Authorization'] = token

  const [
    totalVarsel,
    totalSamtale,
    totalBekreftelse,
    totalTilbakemelding,
    totalLokalplan,
    schoolsVarsel,
    schoolsSamtale,
    categories
  ] = await Promise.all([
    axios.get(urlTotalVarsel),
    axios.get(urlTotalSamtale),
    axios.get(urlTotalBekreftelse),
    axios.get(urlTotalTilbakemelding),
    axios.get(urlTotalLokalplan),
    axios.get(urlSchoolsVarsel),
    axios.get(urlSchoolsSamtale),
    axios.get(urlCategories)
  ])

  const stats = repackStats({
    totalVarsel: totalVarsel.data,
    totalSamtale: totalSamtale.data,
    totalBekreftelse: totalBekreftelse.data,
    totalTilbakemelding: totalTilbakemelding.data,
    totalLokalplan: totalLokalplan.data,
    schoolsVarsel: schoolsVarsel.data,
    schoolsSamtale: schoolsSamtale.data,
    categories: categories.data
  })

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, stats: stats })

  reply.view('statistikk', viewOptions)
}
