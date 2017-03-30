'use strict'

const handlers = require('../handlers/warnings')

module.exports = [
  {
    method: 'GET',
    path: '/warning/{studentID}',
    handler: handlers.writeWarning,
    config: {
      description: 'Prepare warning for {studentID}'
    }
  },
  {
    method: 'POST',
    path: '/warning/preview/{studentID}',
    handler: handlers.generateWarningPreview,
    config: {
      description: 'Show warning preview for {studentID}'
    }
  },
  {
    method: 'POST',
    path: '/warning/{studentID}',
    handler: handlers.submitWarning,
    config: {
      description: 'Submit warning for {studentID}'
    }
  }
]
