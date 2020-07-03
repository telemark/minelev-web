const axios = require('axios').default
const config = require('../config')
const generateSystemJwt = require('../lib/generate-system-jwt')
const createViewOptions = require('../lib/create-view-options')
const validDocTypes = ['atferd', 'fag', 'orden', 'samtale', 'yff-bekreftelse', 'yff-lokalplan', 'yff-tilbakemelding', 'notat-fag', 'notat-sosial', 'notat-personlig']
const applyLogDescriptions = require('../lib/apply-log-description')
const logger = require('../lib/logger')

module.exports.getFrontpage = async (request, h) => {
  const yar = request.yar
  const documentAdded = yar.get('documentAdded')
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.LOGS_SERVICE_URL}/logs/search`
  const myContactClasses = yar.get('myContactClasses') || []
  let mongoQuery = { userId: userId, documentCategory: { $in: validDocTypes } }

  logger('info', ['index', 'getFrontpage', 'userId', userId, 'start'])

  if (myContactClasses.length > 0) {
    const classIds = myContactClasses.map(item => item.Id)
    mongoQuery = { $or: [{ userId: userId }, { studentMainGroupName: { $in: classIds } }], documentCategory: { $in: validDocTypes } }
    logger('info', ['index', 'getFrontpage', 'userId', userId, 'contact teacher', classIds.join(', ')])
  }

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, latestIdDocument: documentAdded ? 'Ok' : '' })

  yar.set('documentAdded', false)

  axios.defaults.headers.common.Authorization = token
  try {
    const { data } = await axios.post(url, mongoQuery)
    viewOptions.logs = data || []
    logger('info', ['index', 'getFrontpage', 'userId', userId, 'got logs', viewOptions.logs.length])
    return h.view('index', viewOptions)
  } catch (error) {
    logger('error', ['index', 'getFrontpage', 'userId', userId, error])
    viewOptions.logs = []
    return h.view('index', viewOptions)
  }
}

module.exports.getLogspage = async (request, h) => {
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const documentId = request.query.documentId
  const url = documentId ? `${config.LOGS_SERVICE_URL}/logs/${documentId}` : `${config.LOGS_SERVICE_URL}/logs/search`
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  let mongoQuery = { documentCategory: { $in: validDocTypes } }

  function isValid (doc) {
    return userId === doc.userId || myContactClasses.map(line => line.Id).includes(doc.studentMainGroupName)
  }

  logger('info', ['index', 'getLogspage', 'userId', userId, 'start'])

  if (request.query.studentUserName) {
    // Retrieve logs for a student
    logger('info', ['index', 'getLogspage', 'userId', userId, 'studentUserName', request.query.studentUserName])
    mongoQuery.studentUserName = request.query.studentUserName
  } else {
    if (myContactClasses.length > 0) {
      // Retrieve logs from me and/or to my classes
      const classIds = myContactClasses.map(item => item.Id)
      logger('info', ['index', 'getLogspage', 'userId', userId, 'classes', classIds.join(', ')])
      mongoQuery = { $or: [{ userId: userId }, { studentMainGroupName: { $in: classIds } }], documentCategory: { $in: validDocTypes } }
    } else {
      // Retrieve logs from me
      mongoQuery.userId = userId
      logger('info', ['index', 'getLogspage', 'userId', userId, 'single'])
    }
  }

  axios.defaults.headers.common.Authorization = token
  let { data: results } = documentId ? await axios.get(url) : await axios.post(url, mongoQuery)

  if (request.query.studentUserName || documentId) {
    results = results.filter(isValid)
  }

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, logs: applyLogDescriptions(results) })

  if (request.query.studentUserName || documentId) {
    logger('info', ['index', 'getLogspage', 'userId', userId, 'detailed logs ok'])
    return h.view('logs-detailed', viewOptions)
  } else {
    logger('info', ['index', 'getLogspage', 'userId', userId, 'multiple logs ok'])
    return h.view('logs', viewOptions)
  }
}

module.exports.getHelppage = (request, h) => {
  const yar = request.yar
  const myContactClasses = yar.get('myContactClasses') || []
  const userId = request.auth.credentials.data.userId
  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses })

  logger('info', ['index', 'getHelppage', 'userId', userId, 'start'])

  return h.view('help', viewOptions)
}

module.exports.doSearch = async (request, h) => {
  const yar = request.yar
  const data = request.payload
  const searchText = data.searchText
  const userId = request.auth.credentials.data.userId
  const token = generateSystemJwt(userId)
  const url = `${config.BUDDY_SERVICE_URL}/students?name=${encodeURIComponent(searchText)}`
  const myContactClasses = yar.get('myContactClasses') || []

  logger('info', ['index', 'doSearch', 'userId', userId, 'searchText', searchText, 'start'])

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, myContactClasses: myContactClasses, searchText: searchText })

  try {
    axios.defaults.headers.common.Authorization = token
    const results = await axios.get(url)
    const payload = results.data

    logger('info', ['index', 'doSearch', 'userId', userId, 'searchText', searchText, 'success', payload.length, 'hits'])
    return h.view('search-results', { viewOptions, students: payload })
  } catch (error) {
    const { status } = error.response
    logger('info', ['index', 'doSearch', 'userId', userId, 'searchText', searchText, status])

    if (status === 404) {
      return h.view('error', { ...viewOptions, statusCode: 500 })
    } else if (status === 401) {
      return h.view('error-no-access', viewOptions)
    } else {
      return h.view('search-results', { ...viewOptions, students: [] })
    }
  }
}
