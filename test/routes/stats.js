'use strict'

const test = require('ava')
const routes = require('../../routes/stats')

test('There are 1 stats route', t => {
  t.is(1, routes.length, 'stats route ok')
})
