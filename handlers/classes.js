'use strict'

const axios = require('axios')
const config = require('../config')
const pkg = require('../package.json')
const generateSystemJwt = require('../lib/generate-system-jwt')

module.exports.showClasses = async (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  let viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses,
    classes: myContactClasses
  }

  reply.view('klasseliste', viewOptions)
}

module.exports.listStudentsInClass = async (request, reply) => {
  const yar = request.yar
  const groupId = request.params.groupID
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/classes/${groupId}/students`
  const myContactClasses = yar.get('myContactClasses') || []
  let viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    credentials: request.auth.credentials,
    myContactClasses: myContactClasses
  }

  axios.defaults.headers.common['Authorization'] = token
  const results = await axios.get(url)
  const payload = results.data

  if (!payload.statusKode) {
    viewOptions.students = payload.map(student => Object.assign(student, {mainGroupName: groupId}))
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
