'use strict'

const test = require('ava')
const routes = require('../../routes/auth')

test('There are 2 auth routes', t => {
  t.is(2, routes.length, 'auth routes ok')
})
