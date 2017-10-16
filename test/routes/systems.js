'use strict'

const test = require('ava')
const routes = require('../../routes/systems')

test('There are 1 systems route', t => {
  t.is(1, routes.length, 'systems route ok')
})
