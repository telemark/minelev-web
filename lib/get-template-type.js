'use strict'

module.exports = data => {
  let template = ''
  if (data.samtaleCategories && /Eleven ønsker ikke samtale/.test(data.samtaleCategories)) {
    template = 'ikke-samtale'
  } else {
    template = data.documentCategory
  }
  return template
}
