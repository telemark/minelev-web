'use strict'

const getSkoleAar = require('get-skole-aar')

module.exports = item => {
  const now = new Date()
  const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
  const data = {
    dato: date,
    navnElev: item.studentName,
    navnAvsender: item.userName,
    navnSkole: item.schoolName,
    tlfSkole: item.schoolPhone,
    tema: item.utviklingCategories || item.undervegsCategories || item.annenCategories || '',
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
