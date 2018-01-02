const handlers = require('../handlers/yff')

module.exports = [
  {
    method: 'GET',
    path: '/yff/{studentUserName}',
    handler: handlers.frontPage,
    config: {
      description: 'Prepare yff frontpage for {studentUserName}'
    }
  },
  {
    method: 'GET',
    path: '/yff/bekreftelse/{studentUserName}',
    handler: handlers.bekreftelse,
    config: {
      description: 'Prepare yff bekreftelse for {studentUserName}'
    }
  },
  {
    method: 'GET',
    path: '/yff/plan/{studentUserName}',
    handler: handlers.plan,
    config: {
      description: 'Prepare yff plan for {studentUserName}'
    }
  },
  {
    method: 'GET',
    path: '/yff/maal/{studentUserName}',
    handler: handlers.maal,
    config: {
      description: 'Prepare yff maal for {studentUserName}'
    }
  },
  {
    method: 'GET',
    path: '/yff/plan/remove/{studentUserName}/{maalID}',
    handler: handlers.removeLineFromPlan,
    config: {
      description: 'Remove maalID from plan for {studentUserName}'
    }
  },
  {
    method: 'GET',
    path: '/yff/evaluation/{studentUserName}/{utplasseringID}',
    handler: handlers.evaluation,
    config: {
      description: 'Prepare yff evaluation for {studentUserName}'
    }
  },
  {
    method: 'POST',
    path: '/yff/preview/{studentUserName}',
    handler: handlers.generatePreview,
    config: {
      description: 'Show preview for {studentUserName}'
    }
  },
  {
    method: 'POST',
    path: '/yff/{studentUserName}',
    handler: handlers.submit,
    config: {
      description: 'Submit documents for {studentUserName}'
    }
  },
  {
    method: 'POST',
    path: '/yff/plan/{studentUserName}',
    handler: handlers.addLineToPlan,
    config: {
      description: 'Add line for {studentUserName} local plan'
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
