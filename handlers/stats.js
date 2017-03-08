'use strict'

const config = require('../config')
const pkg = require('../package.json')

module.exports.getStats = (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  var viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses
  }
  const liveStatsUrl = config.LIVESTATS_URL

  Wreck.get(liveStatsUrl, wreckOptions, (error, response, payload) => {
    if (error) {
      reply(error)
    } else {
      viewOptions.liveStats = payload
      reply.view('statistikk', viewOptions)
    }
  })
}
