'use strict'

const test = require('ava')
const routes = require('../../routes/classes')

test('There are 2 classes routes', t => {
  t.is(2, routes.length, 'classes routes ok')
})
