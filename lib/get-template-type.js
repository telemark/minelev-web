module.exports = data => {
  let template = ''
  if (data.samtaleCategories && /Eleven ønsker ikke samtale/.test(data.samtaleCategories)) {
    template = 'ikke-samtale'
  } else if (/notat/.test(data.documentCategory)) {
    template = 'notat'
  } else {
    template = data.documentCategory
  }
  return template
}
