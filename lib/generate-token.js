const jwt = require('jsonwebtoken')
const pkg = require('../package.json')

module.exports = settings => {
  const payload = {
    system: pkg.name,
    version: pkg.version,
    caller: settings.userId || pkg.name
  }

  const options = {
    expiresIn: '1m',
    issuer: 'https://auth.t-fk.no'
  }

  const token = jwt.sign(payload, settings.secret, options)

  return `Bearer ${token}`
}
