'use strict'

const axios = require('axios')
const config = require('../config')
const generateSystemJwt = require('./generate-system-jwt')

module.exports = userId => {
  return new Promise(async (resolve, reject) => {
    const token = generateSystemJwt(userId)
    const url = `${config.BUDDY_SERVICE_URL}/teachers/${userId}/contactclasses`
    axios.defaults.headers.common['Authorization'] = token

    try {
      const result = await axios.get(url)
      resolve(result.data)
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}
