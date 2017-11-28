module.exports = (skrivID, tilbakemeldinger) => {
  const tilbakemelding = tilbakemeldinger.filter(tilbakemelding => skrivID === tilbakemelding.bedriftID)
  let text = 'hide-me'
  if (tilbakemelding && tilbakemelding[0] && tilbakemelding[0].bedriftID === skrivID) {
    text = 'show-me'
  }
  return text
}
