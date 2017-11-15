'use strict'

const axios = require('axios')
const config = require('../config')
const logger = require('./logger')

module.exports = options => {
  return new Promise(async (resolve, reject) => {
    if (!options || !options.token || !options.userId || !options.query) {
      reject(new Error('Missing required input. token, userId and query must be included in the options object.'))
    }
    const url = `${config.LOGS_SERVICE_URL}/logs/search`
    axios.defaults.headers.common['Authorization'] = options.token
    logger('info', ['lib', 'search-logs', 'userId', options.userId, 'query', JSON.stringify(options.query), 'start'])
    try {
      const result = await axios.post(url, options.query)
      logger('info', ['lib', 'search-logs', 'userId', options.userId, 'query', JSON.stringify(options.query), 'success', result.data.length])
      resolve(result.data)
    } catch (error) {
      logger('error', ['lib', 'search-logs', 'userId', options.userId, 'query', options.query, error])
      resolve([])
    }
  })
}
