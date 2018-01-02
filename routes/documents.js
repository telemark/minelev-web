const handlers = require('../handlers/documents')

module.exports = [
  {
    method: 'GET',
    path: '/document/{studentUserName}',
    handler: handlers.write,
    config: {
      description: 'Prepare document for {studentUserName}'
    }
  },
  {
    method: 'POST',
    path: '/document/preview/{studentUserName}',
    handler: handlers.generatePreview,
    config: {
      description: 'Show preview for {studentUserName}'
    }
  },
  {
    method: 'POST',
    path: '/document/{studentUserName}',
    handler: handlers.submit,
    config: {
      description: 'Submit documents for {studentUserName}'
    }
  }
]
