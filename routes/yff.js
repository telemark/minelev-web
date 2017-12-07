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
    path: '/yff/bekreftelse/{studentID}',
    handler: handlers.bekreftelse,
    config: {
      description: 'Prepare yff bekreftelse for {studentID}'
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
    path: '/yff/maal/{studentID}',
    handler: handlers.maal,
    config: {
      description: 'Prepare yff maal for {studentID}'
    }
  },
  {
    method: 'GET',
    path: '/yff/plan/remove/{studentID}/{maalID}',
    handler: handlers.removeLineFromPlan,
    config: {
      description: 'Remove maalID from plan for {studentID}'
    }
  },
  {
    method: 'GET',
    path: '/yff/evaluation/{studentID}/{utplasseringID}',
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
  },
  {
    method: 'POST',
    path: '/yff/plan/{studentID}',
    handler: handlers.addLineToPlan,
    config: {
      description: 'Add line for {studentID} local plan'
    }
  },
  {
    method: 'POST',
    path: '/yff/brreg',
    handler: handlers.lookupBrreg,
    config: {
      description: 'Lookup brreg'
    }
  }
]
