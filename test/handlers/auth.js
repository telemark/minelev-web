'use strict'

const test = require('ava')
const handlers = require('../../handlers/auth')

test('auth handlers test', t => {
  t.truthy(handlers.doSignIn, 'handler has method doSignIn')
  t.truthy(handlers.doSignOut, 'handler has method doSignOut')
})
