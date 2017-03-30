'use strict'

const handlers = require('../handlers/followups')

module.exports = [
  {
    method: 'GET',
    path: '/followup/{studentID}',
    handler: handlers.writeFollowup,
    config: {
      description: 'Prepare followup for {studentID}'
    }
  },
  {
    method: 'POST',
    path: '/followup/preview/{studentID}',
    handler: handlers.generateFollowupPreview,
    config: {
      description: 'Show followup preview for {studentID}'
    }
  },
  {
    method: 'POST',
    path: '/followup/{studentID}',
    handler: handlers.submitFollowup,
    config: {
      description: 'Submit followup for {studentID}'
    }
  }
]
