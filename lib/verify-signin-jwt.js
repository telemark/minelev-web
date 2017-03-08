'use strict'

const config = require('../config')
const jwt = require('jsonwebtoken')
const encryptor = require('simple-encryptor')(config.ENCRYPTOR_SECRET)

module.exports = token => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('Missing required signin jwt'))
    } else {
      jwt.verify(token, config.JWT_SECRET, (error, decoded) => {
        if (error) {
          reject(error)
        } else {
          const decrypted = encryptor.decrypt(decoded.data)
          resolve(Object.assign(decrypted))
        }
      })
    }
  })
}
