const addMessage = require('azure-queue-add-message')
const logger = require('./logger')
const { MESSAGE_QUEUE_CONNECTION_STRING, MESSAGE_QUEUE_NAME } = require('../config')

module.exports = async message => {
  const options = {
    connectionString: MESSAGE_QUEUE_CONNECTION_STRING,
    queueName: MESSAGE_QUEUE_NAME,
    message: message
  }
  logger('info', ['queue-message', 'start'])
  try {
    const result = await addMessage(options)
    logger('info', ['queue-message', 'success'])
    return result
  } catch (error) {
    logger('error', ['queue-message', error])
    return false
  }
}