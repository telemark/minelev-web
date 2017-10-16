'use strict'

const test = require('ava')
const handlers = require('../../handlers/reports')

test('reports handlers test', t => {
  t.truthy(handlers.getWarningsClassReport, 'handler has method getWarningsClassReport')
  t.truthy(handlers.getFollowupsClassReport, 'handler has method getFollowupsClassReport')
})
