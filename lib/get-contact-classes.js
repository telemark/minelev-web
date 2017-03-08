'use strict'

const axios = require('axios')
const config = require('../config')
const generateSystemJwt = require('./generate-system-jwt')

module.exports = userId => {
  return new Promise((resolve, reject) => {
    const token = generateSystemJwt(userId)
    const url = `${config.BUDDY_SERVICE_URL}/teachers/${userId}/contactclasses`

    axios.defaults.headers.common['Authorization'] = token

    axios.get(url)
      .then(result => resolve(result.data))
      .catch(error => reject(error))
  })
}
