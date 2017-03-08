'use strict'

const Hapi = require('hapi')
// const Hoek = require('hoek')
// const hapiAuthCookie = require('hapi-auth-cookie')
// const hapiAuthJwt2 = require('hapi-auth-jwt2')
const server = new Hapi.Server()
const config = require('./config')
const louieService = require('./index')
const validate = require('./lib/validateJWT')
const validateAPI = require('./lib/validateAPI')

const goodOptions = {
  ops: {
    interval: 900000
  },
  reporters: {
    console: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ log: '*', ops: '*', error: '*' }]
    }, {
      module: 'good-console'
    }, 'stdout']
  }
}

const yarOptions = {
  storeBlank: false,
  cookieOptions: {
    password: config.YAR_SECRET,
    isSecure: false
  }
}

const plugins = [
  {register: require('hapi-auth-cookie')},
  {register: require('hapi-auth-jwt2')},
  {register: require('vision')},
  {register: require('inert')},
  {register: require('yar'), options: yarOptions},
  {register: require('good'), options: goodOptions}
]

function endIfError (error) {
  if (error) {
    console.error(error)
    process.exit(1)
  }
}

server.connection({
  port: config.WEB_SERVER_PORT
})

server.register(plugins, (error) => {
  endIfError(error)

  server.auth.strategy('session', 'cookie', {
    password: config.COOKIE_SECRET,
    cookie: 'web-minelev-session',
    validateFunc: validate,
    redirectTo: `${config.AUTH_SERVICE_URL}?origin=${config.ORIGIN_URL}`,
    isSecure: false
  })

  server.auth.default('session')

  server.auth.strategy('jwt', 'jwt', {
    key: config.JWT_SECRET,          // Never Share your secret key
    validateFunc: validateAPI,            // validate function defined above
    verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
  })

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'views',
    helpersPath: 'views/helpers',
    partialsPath: 'views/partials',
    layoutPath: 'views/layouts',
    layout: true,
    compileMode: 'sync'
  })

  server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: 'public'
      }
    },
    config: {
      auth: false
    }
  })

  registerRoutes()
})

function registerRoutes () {
  server.register([
    {
      register: louieService,
      options: {}
    }
  ], function (err) {
    if (err) {
      console.error('Failed to load a plugin:', err)
    }
  })
}

module.exports.start = () => {
  server.start(() => {
    console.log('Server running at:', server.info.uri)
  })
}

module.exports.stop = () => {
  server.stop(() => {
    console.log('Server stopped')
  })
}
