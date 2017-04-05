'use strict'

const winston = require('winston')
const verifySigninJwt = require('../lib/verify-signin-jwt')
const getContactClasses = require('../lib/get-contact-classes')
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)()
  ]
})
const formatLogMessage = require('../lib/format-log-message')

module.exports.doSignIn = async (request, reply) => {
  const token = request.query.jwt
  const nextPath = request.query.nextPath
  const yar = request.yar
  try {
    const user = await verifySigninJwt(token)
    const myContactClasses = await getContactClasses(user.userId)

    logger.info(formatLogMessage(['auth', 'signin', 'verified', user.userId]))

    request.cookieAuth.set({data: user, token: token})
    yar.set('myContactClasses', Array.isArray(myContactClasses) ? myContactClasses : [])

    if (nextPath && nextPath.length > 0) {
      reply.redirect(nextPath)
    } else {
      reply.redirect('/')
    }
  } catch (error) {
    logger.error(formatLogMessage(['auth', error]))
    reply(error)
  }
}

module.exports.doSignOut = (request, reply) => {
  request.cookieAuth.clear()
  reply.redirect('/')
}
