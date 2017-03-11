'use strict'

const axios = require('axios')
const config = require('../config')
const generateSystemJwt = require('../lib/generate-system-jwt')
const createViewOptions = require('../lib/create-view-options')

module.exports.showClasses = async (request, reply) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/teachers/${userId}/contactclasses`
  const myContactClasses = yar.get('myContactClasses') || []
  let viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses })

  axios.defaults.headers.common['Authorization'] = token
  const results = await axios.get(url)
  const payload = results.data

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

module.exports.listStudentsInClass = async (request, reply) => {
  const yar = request.yar
  const groupId = request.params.groupID
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/classes/${groupId}/students`
  const myContactClasses = yar.get('myContactClasses') || []

  let viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses })

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
