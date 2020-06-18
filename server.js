const Hapi = require('@hapi/hapi')
const config = require('./config')
const routes = require('./routes')
const auth = require('./routes/auth')
const stats = require('./routes/stats')
const classes = require('./routes/classes')
const reports = require('./routes/reports')
const documents = require('./routes/documents')
const notes = require('./routes/notes')
const systems = require('./routes/systems')
const yff = require('./routes/yff')
const logger = require('./lib/logger')
const createViewOptions = require('./lib/create-view-options')

// Create a server with a host and port
const server = Hapi.server({
  port: config.WEB_SERVER_PORT
})

// Add the routes
server.route(auth)
server.route(classes)
server.route(documents)
server.route(notes)
server.route(reports)
server.route(routes)
server.route(stats)
server.route(systems)
server.route(yff)

const yarOptions = {
  storeBlank: false,
  cookieOptions: {
    password: config.YAR_SECRET,
    isSecure: process.env.NODE_ENV !== 'development',
    isSameSite: 'Lax'
  }
}

const plugins = [
  { plugin: require('hapi-auth-cookie') },
  { plugin: require('@hapi/vision') },
  { plugin: require('@hapi/inert') },
  { plugin: require('yar'), options: yarOptions }
]

// Start the server
async function start () {
  await server.register(plugins)

  server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: 'public'
      }
    },
    options: {
      auth: false
    }
  })

  server.ext('onPreResponse', ({ response }, reply) => {
    if (response && response.isBoom) {
      const errName = response.output.payload.error
      const statusCode = response.output.payload.statusCode

      const viewOptions = createViewOptions({ statusCode, errName }) || { statusCode, errName }
      return reply.view('error', viewOptions).code(statusCode)
    }

    return reply.continue
  })

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'views',
    layout: true,
    layoutPath: 'views/layouts',
    helpersPath: 'views/helpers',
    partialsPath: 'views/partials'
  })

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'web-minelev-session',
      password: config.COOKIE_SECRET,
      isSecure: process.env.NODE_ENV !== 'development',
      isSameSite: 'Lax'
    },
    redirectTo: `${config.AUTH_SERVICE_URL}/login?origin=${config.ORIGIN_URL}`,
    appendNext: 'nextPath'
  })

  server.auth.default('session')

  await server.start()
  logger('info', ['server', 'Server running', server.info.uri])
}

start().catch(error => {
  logger('error', ['server', error])
})
