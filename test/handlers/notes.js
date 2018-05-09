const test = require('ava')
const handlers = require('../../handlers/notes')

test('notes handlers test', t => {
  t.truthy(handlers.write, 'handler has method write')
  t.truthy(handlers.generatePreview, 'handler has method generatePreview')
  t.truthy(handlers.submit, 'handler has method submit')
})
