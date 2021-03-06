'use strict'

const test = require('ava')
const handlers = require('../../handlers/yff')

test('yff handlers test', t => {
  t.truthy(handlers.frontPage, 'handler has method frontPage')
  t.truthy(handlers.bekreftelse, 'handler has method bekreftelse')
  t.truthy(handlers.plan, 'handler has method plan')
  t.truthy(handlers.maal, 'handler has method maal')
  t.truthy(handlers.evaluation, 'handler has method evaluation')
  t.truthy(handlers.generatePreview, 'handler has method generatePreview')
  t.truthy(handlers.submit, 'handler has method submit')
  t.truthy(handlers.addLineToPlan, 'handler has method addLineToPlan')
  t.truthy(handlers.removeLineFromPlan, 'handler has method removeLineFromPlan')
  t.truthy(handlers.lookupBrreg, 'handler has method lookupBrreg')
})
