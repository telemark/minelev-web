'use strict'

const test = require('ava')
const routes = require('../../routes/yff')

test('There are 10 yff routes', t => {
  t.is(10, routes.length, 'Yff routes ok')
})
