const axios = require('axios')
const config = require('../config')
const generateSystemJwt = require('../lib/generate-system-jwt')
const createViewOptions = require('../lib/create-view-options')
const logger = require('../lib/logger')

module.exports.showClasses = async (request, h) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, classes: myContactClasses })

  return h.view('klasseliste', viewOptions)
}

module.exports.listStudentsInClass = async (request, h) => {
  const yar = request.yar
  const groupId = request.params.groupID
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/classes/${groupId}/students`
  const myContactClasses = yar.get('myContactClasses') || []

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, groupId })

  logger('info', ['classes', 'listStudentsInClass', 'userId', userId, 'start'])

  axios.defaults.headers.common.Authorization = token

  try {
    const results = await axios.get(url)
    const payload = results.data

    viewOptions.students = payload.map(student => Object.assign(student, { mainGroupName: groupId }))
    logger('info', ['classes', 'listStudentsInClass', 'userId', userId, 'success'])

    return h.view('klasse-elevliste', viewOptions)
  } catch (error) {
    const status = error.response.status
    logger('error', ['classes', 'listStudentsInClass', 'userId', userId, 'groupId', 'unable to get data', error.response.config.url, status, error])

    if (status === 401 || status === 403) {
      viewOptions.students = []
      return h.view('error-no-access-to-class', { ...viewOptions, groupId: groupId.toUpperCase() })
    } else {
      return h.view('error', { ...viewOptions, statusCode: 500 })
    }
  }
}
