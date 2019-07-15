const getSkoleAar = require('get-skole-aar')

module.exports = data => {
  const title = [
    'Notat'
  ]

  title.push(getSkoleAar())

  return title.join(' - ')
}
