'use strict'

const test = require('ava')
const routes = require('../../routes')

test('There are 5 main routes', t => {
  t.is(5, routes.length, 'main routes ok')
})
