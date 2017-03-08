'use strict'

const stats = require('../handlers/stats')

module.exports = [
  {
    method: 'GET',
    path: '/stats',
    handler: stats.getStats,
    config: {
      description: 'Statistics for everything'
    }
  }
]
