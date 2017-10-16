'use strict'

const test = require('ava')
const routes = require('../../routes/reports')

test('There are 2 reports routes', t => {
  t.is(2, routes.length, 'reports routes ok')
})
