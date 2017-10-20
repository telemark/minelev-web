'use strict'

const test = require('ava')
const routes = require('../../routes/yff')

test('There are 7 yff routes', t => {
  t.is(7, routes.length, 'Yff routes ok')
})
