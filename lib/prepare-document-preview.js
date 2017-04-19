'use strict'

const getSkoleAar = require('get-skole-aar')

module.exports = item => {
  const documentDate = new Date(item.documentDate)
  const date = datePadding(documentDate.getDate()) + '.' + datePadding(documentDate.getMonth() + 1) + '.' + documentDate.getFullYear()
  const data = {
    dato: date,
    navnElev: item.studentName,
    navnAvsender: item.userName,
    navnSkole: item.schoolName,
    tlfSkole: item.schoolPhone,
    Arsak: item.behaviourCategories || item.orderCategories || item.gradesCategories || item.samtaleCategories || '',
    fag: item.coursesList || '',
    varselPeriode: item.period.toLowerCase(),
    skoleAar: getSkoleAar()
  }

  return data
}

function datePadding (date) {
  let padded = date.toString()
  if (padded.length === 1) {
    padded = '0' + date.toString()
  }
  return padded
}
