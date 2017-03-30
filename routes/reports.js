'use strict'

const handlers = require('../handlers/reports')

module.exports = [
  {
    method: 'GET',
    path: '/reports/warnings/{groupID}',
    handler: handlers.getWarningsClassReport,
    config: {
      description: 'Warning Reports for a spesific class'
    }
  },
  {
    method: 'GET',
    path: '/reports/followups/{groupID}',
    handler: handlers.getFollowupsClassReport,
    config: {
      description: 'Followup Reports for a spesific class'
    }
  }
]
