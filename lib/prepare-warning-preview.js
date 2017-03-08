'use strict'

var getSkoleAar = require('get-skole-aar')

function prepareWarningPreview (item) {
  var now = new Date()
  var date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
  var data = {
    dato: date,
    navnElev: item.studentName,
    navnAvsender: item.userName,
    navnSkole: item.schoolName,
    tlfSkole: item.schoolPhone,
    Arsak: item.behaviourCategories || item.orderCategories || item.gradesCategories || '',
    fag: item.coursesList || '',
    varselPeriode: item.period.toLowerCase(),
    skoleAar: getSkoleAar()
  }

  return data
}

function datePadding (date) {
  var padded = date.toString()
  if (padded.length === 1) {
    padded = '0' + date.toString()
  }
  return padded
}

module.exports = prepareWarningPreview
