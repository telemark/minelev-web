const formatDateTime = require('./formatDateTime')

module.exports = plans => {
  let text = 'Lokal læreplan er ikke sendt til elev og arkiv'
  if (plans.length > 0) {
    const latest = plans.reduce((prev, current) => {
      if (prev === '') {
        return current.timeStamp
      } else if (current.timeStamp > prev) {
        return current.timeStamp
      }
    }, '')
    text = `Sist sendt ut og arkivert ${formatDateTime(latest)}`
  }
  return text
}
