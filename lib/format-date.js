const datePadding = require('./date-padding')

const monthNames = {
  1: 'januar',
  2: 'februar',
  3: 'mars',
  4: 'april',
  5: 'mai',
  6: 'juni',
  7: 'juli',
  8: 'august',
  9: 'september',
  10: 'oktober',
  11: 'november',
  12: 'desember'
}

module.exports = datestring => {
  const date = new Date(datestring)
  return `${datePadding(date.getDate())}. ${monthNames[date.getMonth() + 1]} ${date.getFullYear()}`
}
