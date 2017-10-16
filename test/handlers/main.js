'use strict'

const test = require('ava')
const handlers = require('../../handlers')

test('main handlers test', t => {
  t.truthy(handlers.getFrontpage, 'handler has method getFrontpage')
  t.truthy(handlers.getLogspage, 'handler has method getLogspage')
  t.truthy(handlers.getHelppage, 'handler has method getHelppage')
  t.truthy(handlers.doSearch, 'handler has method doSearch')
})
