'use strict'

const handlers = require('../handlers/reports')

module.exports = [
  {
    method: 'GET',
    path: '/reports/class/{groupID}',
    handler: handlers.getClassReport,
    config: {
      description: 'Report for a spesific class'
    }
  }
]
