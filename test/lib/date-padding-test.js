const test = require('ava')
const datePadding = require('../../lib/date-padding')

test('it pads single digit', t => {
  t.is('01', datePadding(1), 'padded ok')
})

test('it does not pad double digit', t => {
  t.is('10', datePadding(10), 'not padded ok')
})
