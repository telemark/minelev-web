'use strict'

const getSchoolInfo = require('tfk-saksbehandling-schools-info')
const config = require('../config')

module.exports = data => {
  if (!data) {
    throw new Error('Missing required input: data object')
  }
  const now = new Date()
  const schoolPhone = getSchoolInfo(data.organizationNumber.replace(/\D/g, '')).phoneNumber
  let followup = {
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
    documentType: 'samtale',
    documentCategory: data.type,
    CALLBACK_STATUS_URL: config.CALLBACK_STATUS_URL
  }

  if (Array.isArray(data.coursesList)) {
    data.coursesList = data.coursesList.join('\n')
  }
  followup.coursesList = data.coursesList

  if (data.type === 'utvikling') {
    if (Array.isArray(data.utviklingCategories)) {
      data.utviklingCategories = data.utviklingCategories.join('\n')
    }
    followup.utviklingCategories = data.utviklingCategories
  }

  if (data.type === 'undervegs') {
    if (Array.isArray(data.undervegsCategories)) {
      data.undervegsCategories = data.undervegsCategories.join('\n')
    }
    followup.undervegsCategories = data.undervegsCategories
  }

  if (data.type === 'annen') {
    if (Array.isArray(data.annenCategories)) {
      data.annenCategories = data.annenCategories.join('\n')
    }
    followup.annenCategories = data.annenCategories
  }

  return followup
}
