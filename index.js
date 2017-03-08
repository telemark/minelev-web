'use strict'

const routes = require('./routes')
const auth = require('./routes/auth')
const stats = require('./routes/stats')
const classes = require('./routes/classes')
const warnings = require('./routes/warnings')

exports.register = (server, options, next) => {
  server.route(routes)
  server.route(auth)
  server.route(stats)
  server.route(classes)
  server.route(warnings)
  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
