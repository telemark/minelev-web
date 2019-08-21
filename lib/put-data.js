const axios = require('axios')
const generateToken = require('./generate-token')
const logger = require('./logger')

module.exports = async options => {
  const token = generateToken(options.config)
  axios.defaults.headers.common.Authorization = token
  logger('info', ['put-data', 'url', options.url, 'ready'])
  try {
    const { data } = await axios.put(options.url, options.data)
    logger('info', ['put-data', 'url', options.url, 'succes'])
    return data
  } catch (error) {
    logger('error', ['put-data', 'url', options.url, error])
    throw error
  }
}
