const birthdateFromId = require('./birthdateFromId')

const monthNames = {
  '01': 'januar',
  '02': 'februar',
  '03': 'mars',
  '04': 'april',
  '05': 'mai',
  '06': 'juni',
  '07': 'juli',
  '08': 'august',
  '09': 'september',
  '10': 'oktober',
  '11': 'november',
  '12': 'desember'
}

module.exports = id => {
  const date = birthdateFromId(id)
  const [day, month, year] = date.split('.')
  return `${parseInt(day, 10)}. ${monthNames[month]} ${year}`
}
