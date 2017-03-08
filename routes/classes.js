'use strict'

const handlers = require('../handlers/classes')

module.exports = [
  {
    method: 'GET',
    path: '/classes',
    handler: handlers.showClasses,
    config: {
      description: 'Show the class'
    }
  },
  {
    method: 'GET',
    path: '/classes/{groupID}',
    handler: handlers.listStudentsInClass,
    config: {
      description: 'List all students in class'
    }
  }
]
