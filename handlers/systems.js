const axios = require('axios')
const config = require('../config')
const logger = require('../lib/logger')

const up = (result) => {
  return result.ping === 'pong' || result.message === 'Only POST is supported' || false
}

module.exports.checkSystems = async (request, h) => {
  const systems = [
    {
      id: 'tjommi',
      url: `${config.BUDDY_SERVICE_URL}/ping`
    },
    {
      id: 'logs',
      url: `${config.LOGS_SERVICE_URL}/ping`
    },
    {
      id: 'auth',
      url: `${config.AUTH_SERVICE_URL}/ping`
    },
    {
      id: 'pdf',
      url: `${config.PDF_SERVICE_URL}`
    }
  ]

  const jobs = systems.map(site => axios(site.url))

  try {
    const checks = await Promise.all(jobs)
    const results = checks.map(check => check.data)
    return systems.map((site, index) => Object.assign(site, { result: results[index], up: up(results[index]) }))
  } catch (error) {
    logger('error', ['systems', 'checkSystems', error])
    throw error
  }
}
