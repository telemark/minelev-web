const config = require('../config')
const verifySigninJwt = require('../lib/verify-signin-jwt')
const getContactClasses = require('../lib/get-contact-classes')
const logger = require('../lib/logger')

module.exports.doSignIn = async (request, h) => {
  const token = request.query.jwt
  const nextPath = request.query.nextPath
  const yar = request.yar

  let user, myContactClasses

  try {
    user = await verifySigninJwt(token)
    logger('info', ['auth', 'doSignIn', 'verified', user.userId])

    request.cookieAuth.set({ data: user, token: token })
  } catch (error) {
    logger('error', ['auth', 'doSignIn', 'verify-jwt', error])
    throw error
  }

  try {
    myContactClasses = await getContactClasses(user.userId)
  } catch (error) {
    logger('error', ['auth', 'doSignIn', 'get-contact-classes', error])
  }

  try {
    yar.set('myContactClasses', Array.isArray(myContactClasses) ? myContactClasses : [])

    if (nextPath && nextPath.length > 0) {
      return h.redirect(nextPath)
    } else {
      return h.redirect('/')
    }
  } catch (error) {
    logger('error', ['auth', 'doSignIn', error])
    throw error
  }
}

module.exports.doSignOut = (request, h) => {
  const userId = request.auth.credentials.data.userId
  logger('info', ['auth', 'doSignOut', userId])
  request.cookieAuth.clear()
  return h.redirect(`${config.AUTH_SERVICE_URL}/logout`)
}
