'use strict'

const handlers = require('../handlers/yff')

module.exports = [
  {
    method: 'GET',
    path: '/yff/{studentID}',
    handler: handlers.frontPage,
    config: {
      description: 'Prepare yff frontpage for {studentID}'
    }
  },
  {
    method: 'GET',
    path: '/yff/information/{studentID}',
    handler: handlers.information,
    config: {
      description: 'Prepare yff information for {studentID}'
    }
  },
  {
    method: 'GET',
    path: '/yff/plan/{studentID}',
    handler: handlers.plan,
    config: {
      description: 'Prepare yff plan for {studentID}'
    }
  },
  {
    method: 'GET',
    path: '/yff/evaluation/{studentID}',
    handler: handlers.evaluation,
    config: {
      description: 'Prepare yff evaluation for {studentID}'
    }
  },
  {
    method: 'POST',
    path: '/yff/preview/{studentID}',
    handler: handlers.generatePreview,
    config: {
      description: 'Show preview for {studentID}'
    }
  },
  {
    method: 'POST',
    path: '/yff/{studentID}',
    handler: handlers.submit,
    config: {
      description: 'Submit documents for {studentID}'
    }
  }
]
