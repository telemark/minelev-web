'use strict'

var getSchoolInfo = require('tfk-saksbehandling-schools-info')
var config = require('../config')

function prepareWarning (data) {
  if (!data) {
    throw new Error('Missing required input: data object')
  }
  var now = new Date()
  var schoolPhone = getSchoolInfo(data.organizationNumber.replace(/\D/g, '')).phoneNumber
  var warning = {
    timeStamp: now.getTime(),
    documentDate: now,
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
    period: data.warningPeriod,
    documentType: 'varsel',
    documentCategory: data.type,
    CALLBACK_STATUS_URL: config.CALLBACK_STATUS_URL
  }

  if (data.type === 'orden') {
    if (Array.isArray(data.orderCategories)) {
      data.orderCategories = data.orderCategories.join('\n')
    }
    warning.orderCategories = data.orderCategories
  }

  if (data.type === 'atferd') {
    if (Array.isArray(data.behaviourCategories)) {
      data.behaviourCategories = data.behaviourCategories.join('\n')
    }
    warning.behaviourCategories = data.behaviourCategories
  }

  if (data.type === 'fag') {
    if (Array.isArray(data.gradesCategories)) {
      data.gradesCategories = data.gradesCategories.join('\n')
    }
    if (Array.isArray(data.coursesList)) {
      data.coursesList = data.coursesList.join('\n')
    }

    warning.gradesCategories = data.gradesCategories
    warning.coursesList = data.coursesList
  }

  return warning
}

module.exports = prepareWarning
