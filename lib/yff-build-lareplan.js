const generateSystemJwt = require('./generate-system-jwt')
const searchLogs = require('./search-logs')

function repackPlanLine (line) {
  return Object.assign({}, line)
}

module.exports = options => {
  return new Promise(async (resolve, reject) => {
    const token = generateSystemJwt(options.userId)
    const maalOptions = {
      userId: options.userId,
      token: token,
      query: {
        documentCategory: 'yff-lokalplan-maal',
        studentUserName: options.studentUserName
      }
    }
    try {
      const plans = await searchLogs(maalOptions)

      resolve(plans.map(repackPlanLine))
    } catch (error) {
      reject(error)
    }
  })
}
