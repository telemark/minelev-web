const { createReadStream } = require('fs')
const FormData = require('form-data')
const { PDF_SERVICE_URL } = require('../config')
const logger = require('./logger')

module.exports = (template, data) => {
  logger('info', ['create-preview', 'start'])
  return new Promise(async (resolve, reject) => {
    let templaterForm = new FormData()
    Object.keys(data).forEach(key => {
      templaterForm.append(key, data[key])
    })
    templaterForm.append('file', createReadStream(template))
    templaterForm.submit(PDF_SERVICE_URL, (error, docx) => {
      if (error) {
        logger('error', ['create-preview', error])
        throw error
      } else {
        let chunks = []
        let totallength = 0
        docx.on('data', function (chunk) {
          chunks.push(chunk)
          totallength += chunk.length
        })
        docx.on('end', function () {
          let results = Buffer.alloc(totallength)
          let pos = 0
          for (var i = 0; i < chunks.length; i++) {
            chunks[i].copy(results, pos)
            pos += chunks[i].length
          }
          logger('info', ['create-preview', 'success'])
          return resolve(results.toString('base64'))
        })
      }
    })
  })
}
