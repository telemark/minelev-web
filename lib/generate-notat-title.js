const getSkoleAar = require('get-skole-aar')

module.exports = data => {
  let title = [
    'Notat'
  ]

  title.push(getSkoleAar())

  return title.join(' - ')
}
