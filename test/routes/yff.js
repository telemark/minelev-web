'use strict'

const test = require('ava')
const routes = require('../../routes/yff')

test('There are 9 yff routes', t => {
  t.is(9, routes.length, 'Yff routes ok')
})
