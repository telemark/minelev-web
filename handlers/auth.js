'use strict'

const verifySigninJwt = require('../lib/verify-signin-jwt')
const getContactClasses = require('../lib/get-contact-classes')

module.exports.doSignIn = async (request, reply) => {
  const token = request.query.jwt
  const yar = request.yar
  const user = await verifySigninJwt(token)
  const myContactClasses = await getContactClasses(user.userId)
  request.cookieAuth.set({data: user, token: token})
  yar.set('myContactClasses', Array.isArray(myContactClasses) ? myContactClasses : [])
  if (user.nextPath && user.nextPath.length > 0) {
    reply.redirect(user.nextPath)
  } else {
    reply.redirect('/')
  }
}

module.exports.doSignOut = (request, reply) => {
  request.cookieAuth.clear()
  reply.redirect('/')
}
