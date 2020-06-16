const schoolsInfo = require('vtfk-schools-info')
const getSkoleAar = require('get-skole-aar')
const config = require('../config')
const { version } = require('../package.json')

function getDocumentType (type) {
  let documentType = ''
  if (/yff/.test(type)) {
    documentType = 'yff'
  } else if (/notat/.test(type)) {
    documentType = 'notat'
  } else {
    documentType = type === 'samtale' ? 'samtale' : 'varsel'
  }
  return documentType
}

module.exports = data => {
  if (!data) {
    throw new Error('Missing required input: data object')
  }
  const now = new Date()
  const school = schoolsInfo({ organizationNumber: data.organizationNumber.replace(/\D/g, '') })[0]
  const schoolPhone = school.phoneNumber
  const document = {
    timeStamp: now.getTime(),
    minElevVersion: version,
    documentDate: data.documentDate || now,
    skjemaUtfyllingStart: data.skjemaUtfyllingStart,
    skjemaUtfyllingStop: now.getTime(),
    userAgent: data.userAgent,
    userId: data.userId,
    userName: data.userName,
    userMail: data.userMail,
    studentName: data.studentName,
    studentFirstName: data.studentFirstName,
    studentMiddleName: data.studentMiddleName,
    studentLastName: data.studentLastName,
    studentId: data.studentId,
    studentUserName: data.studentUserName,
    studentMail: data.studentMail,
    studentPhone: data.studentPhone,
    studentMainGroupName: data.studentMainGroupName,
    schoolId: data.schoolId,
    schoolName: data.schoolName,
    schoolPhone: schoolPhone,
    schoolOrganizationNumber: data.organizationNumber.replace(/\D/g, ''),
    period: data.warningPeriod || '',
    documentType: getDocumentType(data.type),
    documentCategory: data.type,
    documentContent: data.noteContent || '',
    CALLBACK_STATUS_URL: config.CALLBACK_STATUS_URL
  }

  if (data.type === 'orden') {
    if (Array.isArray(data.orderCategories)) {
      data.orderCategories = data.orderCategories.join('\n')
    }
    document.orderCategories = data.orderCategories
  }

  if (data.type === 'atferd') {
    if (Array.isArray(data.behaviourCategories)) {
      data.behaviourCategories = data.behaviourCategories.join('\n')
    }
    document.behaviourCategories = data.behaviourCategories
  }

  if (data.type === 'fag') {
    if (Array.isArray(data.gradesCategories)) {
      data.gradesCategories = data.gradesCategories.join('\n')
    }
    if (Array.isArray(data.coursesList)) {
      data.coursesList = data.coursesList.join('\n')
    }

    document.gradesCategories = data.gradesCategories
    document.coursesList = data.coursesList
  }

  if (data.type === 'samtale') {
    if (Array.isArray(data.samtaleCategories)) {
      data.samtaleCategories = data.samtaleCategories.join('\n')
    }
    document.samtaleCategories = data.samtaleCategories
    document.period = getSkoleAar()
  }

  return document
}
