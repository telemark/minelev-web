'use strict'

module.exports = data => {
  const report = []

  data.forEach(item => {
    if (item.documentCategory === 'fag') {
      item.coursesList.split('\n').forEach(course => {
        report.push({
          documentId: item._id,
          studentName: item.studentName,
          userName: item.userName,
          period: item.period,
          category: item.documentCategory,
          course: course,
          description: item.gradesCategories,
          date: item.timeStamp
        })
      })
    } else {
      report.push({
        documentId: item._id,
        studentName: item.studentName,
        userName: item.userName,
        period: item.period,
        category: item.documentCategory,
        course: '',
        description: item.gradesCategories || item.orderCategories || item.behaviourCategories || '',
        date: item.timeStamp
      })
    }
  })

  return report
}
