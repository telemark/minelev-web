module.exports = (skrivID, tilbakemeldinger) => {
  const tilbakemelding = tilbakemeldinger.filter(tilbakemelding => skrivID === tilbakemelding.bedriftID)
  let text = 'show-me'
  if (tilbakemelding && tilbakemelding[0] && tilbakemelding[0].bedriftID === skrivID) {
    text = 'hide-me'
  }
  return text
}
