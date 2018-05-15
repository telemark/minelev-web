module.exports = data => {
  let title = ['Notat']
  if (data.documentCategory === 'notat-fag') {
    title.push('faglig')
  } else if (data.documentCategory === 'notat-sosial') {
    title.push('sosialt')
  } else if (data.documentCategory === 'notat-personlig') {
    title.push('personlig')
  }
  return title.join(' - ')
}
