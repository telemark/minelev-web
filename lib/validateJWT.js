'use strict'

module.exports = (request, session, callback) => {
  const jwt = require('jsonwebtoken')
  const config = require('../config')
  const credentials = session
  if (!credentials) {
    return callback(null, false)
  } else {
    const token = credentials.token
    jwt.verify(token, config.JWT_SECRET, (error, decoded) => {
      if (error) {
        return callback(null, false)
      } else {
        return callback(null, decoded)
      }
    })
  }
}
