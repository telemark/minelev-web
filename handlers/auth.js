'use strict'

const config = require('../config')
const verifySigninJwt = require('../lib/verify-signin-jwt')
const getContactClasses = require('../lib/get-contact-classes')
const logger = require('../lib/logger')

module.exports.doSignIn = async (request, reply) => {
  const token = request.query.jwt
  const nextPath = request.query.nextPath
  const yar = request.yar
  try {
    const user = await verifySigninJwt(token)
    const myContactClasses = await getContactClasses(user.userId)

    logger('info', ['auth', 'doSignIn', 'verified', user.userId])

    request.cookieAuth.set({data: user, token: token})
    yar.set('myContactClasses', Array.isArray(myContactClasses) ? myContactClasses : [])

    if (nextPath && nextPath.length > 0) {
      reply.redirect(nextPath)
    } else {
      reply.redirect('/')
    }
  } catch (error) {
    logger('error', ['auth', 'doSignIn', error])
    reply(error)
  }
}

module.exports.doSignOut = (request, reply) => {
  const userId = request.auth.credentials.data.userId
  logger('info', ['auth', 'doSignOut', userId])
  request.cookieAuth.clear()
  reply.redirect(`${config.AUTH_SERVICE_URL}/logout`)
}
