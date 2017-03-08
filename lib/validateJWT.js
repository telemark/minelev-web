'use strict'

function validateJWT (request, session, callback) {
  var jwt = require('jsonwebtoken')
  var config = require('../config')
  var credentials = session
  if (!credentials) {
    return callback(null, false)
  } else {
    var token = credentials.token
    jwt.verify(token, config.JWT_SECRET, function (error, decoded) {
      if (error) {
        return callback(null, false)
      } else {
        return callback(null, decoded)
      }
    })
  }
}

module.exports = validateJWT
