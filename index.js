'use strict'

const routes = require('./routes')
const auth = require('./routes/auth')
const stats = require('./routes/stats')
const classes = require('./routes/classes')
const reports = require('./routes/reports')
const warnings = require('./routes/warnings')
const systems = require('./routes/systems')

exports.register = (server, options, next) => {
  server.route(routes)
  server.route(auth)
  server.route(stats)
  server.route(classes)
  server.route(reports)
  server.route(warnings)
  server.route(systems)
  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
