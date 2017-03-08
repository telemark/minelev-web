'use strict'

const axios = require('axios')
const config = require('../config')
const pkg = require('../package.json')
const generateSystemJwt = require('../lib/generate-system-jwt')

module.exports.getStats = async (request, reply) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.LOGS_SERVICE_URL}/stats/schools`
  const myContactClasses = yar.get('myContactClasses') || []

  axios.defaults.headers.common['Authorization'] = token
  const results = await axios.get(url)

  const viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses,
    stats: results.data
  }

  reply.view('statistikk', viewOptions)
}
