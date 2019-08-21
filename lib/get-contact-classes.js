'use strict'

const axios = require('axios')
const config = require('../config')
const generateSystemJwt = require('./generate-system-jwt')

module.exports = async userId => {
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/teachers/${userId}/contactclasses`
  axios.defaults.headers.common.Authorization = token

  try {
    const { data } = await axios.get(url)
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}
