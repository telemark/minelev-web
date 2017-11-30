const generateSystemJwt = require('./generate-system-jwt')
const searchLogs = require('./search-logs')

function repackPlanLine (prev, curr) {
  const key = curr.utplasseringID !== '' ? curr.utplasseringID : 'ub'
  if (prev.hasOwnProperty(key)) {
    prev[key].line.push(curr)
  } else {
    prev[key] = {
      utplasseringsSted: curr.utplasseringsSted,
      line: [curr]
    }
  }
  return prev
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
      const reduced = plans.reduce(repackPlanLine, {})
      resolve(Object.values(reduced))
    } catch (error) {
      reject(error)
    }
  })
}
