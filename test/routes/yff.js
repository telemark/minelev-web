'use strict'

const test = require('ava')
const routes = require('../../routes/yff')

test('There are 8 yff routes', t => {
  t.is(8, routes.length, 'Yff routes ok')
})
