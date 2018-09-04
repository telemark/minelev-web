'use strict'

const axios = require('axios')
const config = require('../config')
const logger = require('../lib/logger')

module.exports.checkSystems = async (request, reply) => {
  const systems = [
    {
      id: 'buddy',
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
    reply(systems.map((site, index) => Object.assign(site, { result: results[index] })))
  } catch (error) {
    logger('error', ['systems', 'checkSystems', error])
    reply(error)
  }
}
