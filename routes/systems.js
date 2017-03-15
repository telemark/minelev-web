'use strict'

const handlers = require('../handlers/systems')

module.exports = [
  {
    method: 'GET',
    path: '/systems',
    handler: handlers.checkSystems,
    config: {
      description: 'System check',
      auth: false
    }
  }
]
