'use strict'

const test = require('ava')
const routes = require('../../routes/documents')

test('There are 3 documents routes', t => {
  t.is(3, routes.length, 'documents routes ok')
})
