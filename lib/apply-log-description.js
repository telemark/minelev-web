module.exports = logs => {
  function logDescription (log) {
    let descriptions = []
    if (log.gradesCategories && log.gradesCategories !== '') {
      descriptions.push(log.gradesCategories)
    }
    if (log.orderCategories && log.orderCategories !== '') {
      descriptions.push(log.orderCategories)
    }
    if (log.behaviourCategories && log.behaviourCategories !== '') {
      descriptions.push(log.behaviourCategories)
    }
    if (log.samtaleCategories && log.samtaleCategories !== '') {
      descriptions.push(log.samtaleCategories)
    }
    if (log.evaluation && Array.isArray(log.evaluation) && log.evaluation.length > 0) {
      log.evaluation.forEach(e => {
        descriptions.push(`${e.name} - ${e.score}`)
      })
    }
    if (log.maal && Array.isArray(log.maal) && log.maal.length > 0) {
      log.maal.forEach(m => {
        descriptions.push(`${m.name} - ${m.score}`)
      })
    }
    return descriptions.join('\n')
  }

  return logs.map(log => Object.assign({}, log, {logDescription: logDescription(log)}))
}
