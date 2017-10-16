'use strict'

const test = require('ava')
const handlers = require('../../handlers/systems')

test('systems handlers test', t => {
  t.truthy(handlers.checkSystems, 'handler has method checkSystems')
})
