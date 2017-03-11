'use strict'

function nameSort (a, b) {
  if (a.studentName.split(' ').pop() < b.studentName.split(' ').pop() )
    return -1
  if ( a.studentName.split(' ').pop() > b.studentName.split(' ').pop() )
    return 1
  return 0
}

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
          category: course,
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
        date: item.timeStamp
      })
    }
  })

  report.sort(nameSort)

  return report
}
