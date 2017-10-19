'use strict'

const axios = require('axios')

module.exports = async url => {
  const { data } = await axios.get(url)
  const kompetansemaal = data['kompetansemaal-kapittel'].kompetansemaalsett[0].kompetansemaal
  console.log(`Retreiving kompetansemaal from ${url}`)
  return kompetansemaal
}
