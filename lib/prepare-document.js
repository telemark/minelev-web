'use strict'

const getSchoolInfo = require('tfk-saksbehandling-schools-info')
const config = require('../config')

module.exports = data => {
  if (!data) {
    throw new Error('Missing required input: data object')
  }
  const now = new Date()
  const schoolPhone = getSchoolInfo(data.organizationNumber.replace(/\D/g, '')).phoneNumber
  let document = {
    timeStamp: now.getTime(),
    documentDate: data.documentDate || now,
    skjemaUtfyllingStart: data.skjemaUtfyllingStart,
    skjemaUtfyllingStop: now.getTime(),
    userAgent: data.userAgent,
    userId: data.userId,
    userName: data.userName,
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
    documentType: data.type === 'samtale' ? 'samtale' : 'varsel',
    documentCategory: data.type,
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
  }

  return document
}
