const axios = require('axios')
const config = require('../config')
const generateSystemJwt = require('../lib/generate-system-jwt')
const repackStats = require('../lib/repack-stats')
const createViewOptions = require('../lib/create-view-options')
const logger = require('../lib/logger')

module.exports.getStats = async (request, h) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const urlTotalVarsel = `${config.STATS_SERVICE_URL}/stats/total/varsel`
  const urlTotalSamtale = `${config.STATS_SERVICE_URL}/stats/total/samtale`
  const urlTotalNotat = `${config.STATS_SERVICE_URL}/stats/total/notat`
  const urlTotalBekreftelse = `${config.STATS_SERVICE_URL}/stats/total/category/yff-bekreftelse`
  const urlTotalTilbakemelding = `${config.STATS_SERVICE_URL}/stats/total/category/yff-tilbakemelding`
  const urlTotalLokalplan = `${config.STATS_SERVICE_URL}/stats/total/category/yff-lokalplan`
  const urlSchoolsVarsel = `${config.STATS_SERVICE_URL}/stats/schools/varsel`
  const urlSchoolsSamtale = `${config.STATS_SERVICE_URL}/stats/schools/samtale`
  const urlSchoolsNotat = `${config.STATS_SERVICE_URL}/stats/schools/notat`
  const urlSchoolsBekreftelse = `${config.STATS_SERVICE_URL}/stats/schools/category/yff-bekreftelse`
  const urlSchoolsTilbakemelding = `${config.STATS_SERVICE_URL}/stats/schools/category/yff-tilbakemelding`
  const urlSchoolsLokalplan = `${config.STATS_SERVICE_URL}/stats/schools/yff-lokalplan`
  const urlCategories = `${config.STATS_SERVICE_URL}/stats/categories`
  const myContactClasses = yar.get('myContactClasses') || []

  logger('info', ['stats', 'getStats', 'user', userId])

  axios.defaults.headers.common.Authorization = token

  const [
    totalVarsel,
    totalSamtale,
    totalNotat,
    totalBekreftelse,
    totalTilbakemelding,
    totalLokalplan,
    schoolsVarsel,
    schoolsSamtale,
    schoolsNotat,
    schoolsBekreftelse,
    schoolsTilbakemelding,
    schoolsLokalplan,
    categories
  ] = await Promise.all([
    axios.get(urlTotalVarsel),
    axios.get(urlTotalSamtale),
    axios.get(urlTotalNotat),
    axios.get(urlTotalBekreftelse),
    axios.get(urlTotalTilbakemelding),
    axios.get(urlTotalLokalplan),
    axios.get(urlSchoolsVarsel),
    axios.get(urlSchoolsSamtale),
    axios.get(urlSchoolsNotat),
    axios.get(urlSchoolsBekreftelse),
    axios.get(urlSchoolsTilbakemelding),
    axios.get(urlSchoolsLokalplan),
    axios.get(urlCategories)
  ])

  const stats = repackStats({
    totalVarsel: totalVarsel.data,
    totalSamtale: totalSamtale.data,
    totalNotat: totalNotat.data,
    totalBekreftelse: totalBekreftelse.data,
    totalTilbakemelding: totalTilbakemelding.data,
    totalLokalplan: totalLokalplan.data,
    schoolsVarsel: schoolsVarsel.data,
    schoolsSamtale: schoolsSamtale.data,
    schoolsNotat: schoolsNotat.data,
    schoolsBekreftelse: schoolsBekreftelse.data,
    schoolsTilbakemelding: schoolsTilbakemelding.data,
    schoolsLokalplan: schoolsLokalplan.data,
    categories: categories.data
  })

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, stats: stats })

  return h.view('statistikk', viewOptions)
}
