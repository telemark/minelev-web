'use strict'

function validateAPI (decoded, request, callback) {
  if (!decoded) {
    return callback(null, false)
  } else {
    return callback(null, true)
  }
}

module.exports = validateAPI
