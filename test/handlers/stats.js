'use strict'

const test = require('ava')
const handlers = require('../../handlers/stats')

test('stats handlers test', t => {
  t.truthy(handlers.getStats, 'handler has method getStats')
})
