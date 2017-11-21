const axios = require('axios')
const config = require('../config')
const features = require('../config/features')

module.exports = studentUserName => {
  return features.usePictures !== false ? axios.get(`${config.PICTURES_SERVICE_URL}/user/${studentUserName}`) : new Promise((resolve, reject) => { resolve(false) })
}
