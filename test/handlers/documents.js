'use strict'

const test = require('ava')
const handlers = require('../../handlers/documents')

test('documents handlers test', t => {
  t.truthy(handlers.write, 'handler has method write')
  t.truthy(handlers.generatePreview, 'handler has method generatePreview')
  t.truthy(handlers.submit, 'handler has method submit')
})
