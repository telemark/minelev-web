const test = require('ava')
const getClassLevel = require('../../lib/get-class-level')

test('returns VG1 for empty', t => {
  t.is(getClassLevel(), 'VG1', 'empty ok')
})

test('returns VG1 for NOTVS:RES', t => {
  t.is(getClassLevel('NOTVS:RES'), 'VG1', 'NOTVS:RES ok')
})

test('returns VG1 for BAMVS:TIV 1HOA', t => {
  t.is(getClassLevel('BAMVS:TIV 1HOA'), 'VG1', 'BAMVS:TIV 1HOA ok')
})

test('returns VG2 for BAMVS:TIV 2HOA', t => {
  t.is(getClassLevel('BAMVS:TIV 2HOA'), 'VG2', 'BAMVS:TIV 2HOA ok')
})
