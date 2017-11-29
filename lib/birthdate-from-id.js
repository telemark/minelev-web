'use strict'

const datePadding = require('./date-padding')

module.exports = id => {
  const personalid = id.toString().replace(/\D+/, '').toString()

  if (personalid.length !== 11) {
    throw new Error('Input must be 11 digits')
  }

  const now = new Date()
  const personalYearEnd = parseInt(personalid.substr(4, 2), 10)
  const realYearEnd = parseInt(now.getFullYear().toString().substr(2, 2), 10)
  let realYearStart = parseInt(now.getFullYear().toString().substr(0, 2), 10)
  let birthYear

  if (personalYearEnd > realYearEnd) {
    realYearStart--
  }

  birthYear = realYearStart.toString() + datePadding(personalYearEnd.toString())

  return personalid.substr(0, 2) + '.' + personalid.substr(2, 2) + '.' + birthYear
}
