'use strict'

const axios = require('axios')
const config = require('../config')
const logger = require('./logger')

module.exports = async options => {
  if (!options || !options.token || !options.userId || !options.query) {
    throw new Error('Missing required input. token, userId and query must be included in the options object.')
  }
  const url = `${config.LOGS_SERVICE_URL}/logs/search`
  axios.defaults.headers.common.Authorization = options.token
  logger('info', ['lib', 'search-logs', 'userId', options.userId, 'query', JSON.stringify(options.query), 'start'])
  try {
    const { data } = await axios.post(url, options.query)
    logger('info', ['lib', 'search-logs', 'userId', options.userId, 'query', JSON.stringify(options.query), 'success', data.length])
    return data
  } catch (error) {
    logger('error', ['lib', 'search-logs', 'userId', options.userId, 'query', options.query, error])
    return []
  }
}
