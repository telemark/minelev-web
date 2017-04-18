'use strict'

const handlers = require('../handlers/documents')

module.exports = [
  {
    method: 'GET',
    path: '/document/{studentID}',
    handler: handlers.write,
    config: {
      description: 'Prepare document for {studentID}'
    }
  },
  {
    method: 'POST',
    path: '/document/preview/{studentID}',
    handler: handlers.generatePreview,
    config: {
      description: 'Show preview for {studentID}'
    }
  },
  {
    method: 'POST',
    path: '/document/{studentID}',
    handler: handlers.submit,
    config: {
      description: 'Submit documents for {studentID}'
    }
  }
]
