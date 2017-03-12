'use strict'

function nameSort (a, b) {
  let num = 0
  if (a.studentName.split(' ').pop() < b.studentName.split(' ').pop()) {
    num = -1
  }

  if (a.studentName.split(' ').pop() > b.studentName.split(' ').pop()) {
    num = 1
  }

  if (num === 0) {
    if (a.period < b.period) {
      num = -1
    }

    if (a.period > b.period) {
      num = 1
    }
  }

  return num
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
