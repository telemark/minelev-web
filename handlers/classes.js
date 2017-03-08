'use strict'

const pkg = require('../package.json')

module.exports.showClasses = (request, reply) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
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

  request.seneca.act({role: 'buddy', list: 'contact-classes', userId: userId}, (error, payload) => {
    if (error) {
      reply(error)
    } else {
      if (!payload.statusKode) {
        viewOptions.classes = payload
        reply.view('klasseliste', viewOptions)
      }
      if (payload.statusKode === 404) {
        viewOptions.classes = []
        reply.view('klasseliste', viewOptions)
      }
      if (payload.statusKode === 401) {
        reply.redirect('/logout')
      }
    }
  })
}

module.exports.listStudentsInClass = (request, reply) => {
  const yar = request.yar
  const groupId = request.params.groupID
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

  request.seneca.act({role: 'buddy', list: 'students', groupId: groupId}, (error, payload) => {
    if (error) {
      reply(error)
    } else {
      if (!payload.statusKode) {
        viewOptions.students = payload
        reply.view('klasse-elevliste', viewOptions)
      }
      if (payload.statusKode === 404) {
        viewOptions.students = []
        reply.view('klasse-elevliste', viewOptions)
      }
      if (payload.statusKode === 401) {
        reply.redirect('/logout')
      }
    }
  })
}
