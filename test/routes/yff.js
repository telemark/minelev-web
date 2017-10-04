'use strict'

const test = require('ava')
const routes = require('../../routes/yff')

test('There are 4 yff route', t => {
  t.is(6, routes.length, 'Yff routes ok')
})
