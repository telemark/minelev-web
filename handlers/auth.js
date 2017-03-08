'use strict'

const verifySigninJwt = require('../lib/verify-signin-jwt')
const getContactClasses = require('../lib/get-contact-classes')
const config = require('../config')
const pkg = require('../package.json')

module.exports.doSignIn = async (request, reply) => {
  try {
    const yar = request.yar
    const user = await verifySigninJwt(request.query.jwt)
    const myContactClasses = await getContactClasses(user.userId)
    request.cookieAuth.set({data: user})
    yar.set('myContactClasses', Array.isArray(myContactClasses) ? myContactClasses : [])
    reply.redirect('/')
  } catch (error) {
    reply(error)
  }
}

module.exports.doSignOut = (request, reply) => {
  request.cookieAuth.clear()
  reply.redirect('/')
}
