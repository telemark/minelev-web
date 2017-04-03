'use strict'

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

    logger(['auth', 'signin', 'verified', user.userId])

    request.cookieAuth.set({data: user, token: token})
    yar.set('myContactClasses', Array.isArray(myContactClasses) ? myContactClasses : [])

    if (nextPath && nextPath.length > 0) {
      reply.redirect(nextPath)
    } else {
      reply.redirect('/')
    }
  } catch (error) {
    logger(['auth', 'error', error])
    reply(error)
  }
}

module.exports.doSignOut = (request, reply) => {
  request.cookieAuth.clear()
  reply.redirect('/')
}
