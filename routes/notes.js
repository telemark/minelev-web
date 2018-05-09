const handlers = require('../handlers/notes')

module.exports = [
  {
    method: 'GET',
    path: '/notes/{studentUserName}',
    handler: handlers.write,
    config: {
      description: 'Prepare note for {studentUserName}'
    }
  },
  {
    method: 'POST',
    path: '/notes/preview/{studentUserName}',
    handler: handlers.generatePreview,
    config: {
      description: 'Show preview for {studentUserName}'
    }
  },
  {
    method: 'POST',
    path: '/notes/{studentUserName}',
    handler: handlers.submit,
    config: {
      description: 'Submit note for {studentUserName}'
    }
  }
]
