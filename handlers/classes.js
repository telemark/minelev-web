'use strict'

const axios = require('axios')
const config = require('../config')
const generateSystemJwt = require('../lib/generate-system-jwt')
const createViewOptions = require('../lib/create-view-options')
const logger = require('../lib/logger')

module.exports.showClasses = async (request, reply) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  let viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, classes: myContactClasses })

  reply.view('klasseliste', viewOptions)
}

module.exports.listStudentsInClass = async (request, reply) => {
  const yar = request.yar
  const groupId = request.params.groupID
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/classes/${groupId}/students`
  const myContactClasses = yar.get('myContactClasses') || []

  let viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses })

  logger('info', ['classes', 'listStudentsInClass', 'userId', userId, 'start'])

  axios.defaults.headers.common['Authorization'] = token

  const results = await axios.get(url)

  const payload = results.data

  if (!payload.statusKode) {
    viewOptions.students = payload.map(student => Object.assign(student, {mainGroupName: groupId}))
    logger('info', ['classes', 'listStudentsInClass', 'userId', userId, 'success'])
    reply.view('klasse-elevliste', viewOptions)
  }
  if (payload.statusKode === 404) {
    viewOptions.students = []
    logger('info', ['classes', 'listStudentsInClass', 'userId', userId, '404'])
    reply.view('klasse-elevliste', viewOptions)
  }
  if (payload.statusKode === 401) {
    logger('info', ['classes', 'listStudentsInClass', 'userId', userId, '401'])
    reply.redirect('/signout')
  }
}
