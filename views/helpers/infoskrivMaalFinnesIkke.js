module.exports = (bedriftID, maals) => {
  const bedriftsmaal = maals.filter(maal => bedriftID === maal.utplasseringID)
  let text = 'hide-me'
  if (bedriftsmaal.length === 0) {
    text = 'show-me'
  }
  return text
}
