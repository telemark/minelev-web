const getSkoleAar = require('get-skole-aar')
const datePadding = require('./date-padding')
const toNynorsk = require('./to-nynorsk')
const generateNotatTitle = require('./generate-notat-title')

module.exports = item => {
  const now = new Date()
  const documentDate = new Date(item.documentDate)
  const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
  const dateDocument = datePadding(documentDate.getDate()) + '.' + datePadding(documentDate.getMonth() + 1) + '.' + documentDate.getFullYear()
  const arsak = item.behaviourCategories || item.orderCategories || item.gradesCategories || item.samtaleCategories || ''
  const arsakNN = toNynorsk(arsak)
  const data = {
    dato: date,
    datoSamtale: dateDocument,
    navnElev: item.studentName,
    navnAvsender: item.userName,
    navnSkole: item.schoolName,
    tlfSkole: item.schoolPhone,
    Arsak: arsak,
    ArsakNN: arsakNN,
    innholdNotat: item.documentContent || '',
    tittel: generateNotatTitle(item),
    innholdSamtale: item.samtaleCategories || '',
    fag: item.coursesList || '',
    varselPeriode: item.period.toLowerCase(),
    skoleAar: getSkoleAar()
  }
  return data
}
