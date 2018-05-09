const test = require('ava')
const routes = require('../../routes/notes')

test('There are 3 notes routes', t => {
  t.is(3, routes.length, 'notes routes ok')
})
