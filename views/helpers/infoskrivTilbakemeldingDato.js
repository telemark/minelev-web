const formatDate = require('./formatDate')

module.exports = (skrivID, tilbakemeldinger) => {
  const tilbakemelding = tilbakemeldinger.filter(tilbakemelding => skrivID === tilbakemelding.bedriftID)
  let text = ''
  if (tilbakemelding && tilbakemelding[0] && tilbakemelding[0].bedriftID === skrivID) {
    text = ` - sendt ${formatDate(tilbakemelding[0].documentDate)}`
  }
  return text
}
