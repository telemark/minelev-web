'use strict'

const axios = require('axios')
const config = require('../config')
const pkg = require('../package.json')
const generateSystemJwt = require('../lib/generate-system-jwt')
const repackStats = require('../lib/repack-stats')

module.exports.getStats = async (request, reply) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const urlTotal = `${config.LOGS_SERVICE_URL}/stats/total`
  const urlSchools = `${config.LOGS_SERVICE_URL}/stats/schools`
  const urlCategories = `${config.LOGS_SERVICE_URL}/stats/categories`
  const myContactClasses = yar.get('myContactClasses') || []

  axios.defaults.headers.common['Authorization'] = token

  const [total, schools, categories] = await Promise.all([axios.get(urlTotal), axios.get(urlSchools), axios.get(urlCategories)])

  const stats = repackStats({total: total.data, schools: schools.data, categories: categories.data})

  const viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses,
    stats: stats
  }

  reply.view('statistikk', viewOptions)
}
