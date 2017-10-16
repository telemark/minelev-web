'use strict'

const test = require('ava')
const handlers = require('../../handlers/classes')

test('classes handlers test', t => {
  t.truthy(handlers.showClasses, 'handler has method showClasses')
  t.truthy(handlers.listStudentsInClass, 'handler has method listStudentsInClass')
})
