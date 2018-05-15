module.exports = documentCategory => {
  let category = 'Varselbrev fag'
  if (documentCategory === 'yff-lokalplan') {
    category = 'Lokal læreplan'
  } else if (documentCategory === 'yff-tilbakemelding') {
    category = 'Tilbakemeldingsskjema'
  } else if (documentCategory === 'yff-bekreftelse') {
    category = 'Bekreftelse utplassering'
  } else if (documentCategory === 'atferd') {
    category = 'Varselbrev atferd'
  } else if (documentCategory === 'orden') {
    category = 'Varselbrev orden'
  } else if (documentCategory === 'samtale') {
    category = 'Elevsamtale'
  } else if (documentCategory === 'notat-fag') {
    category = 'Notat - faglig'
  } else if (documentCategory === 'notat-sosial') {
    category = 'Notat - sosialt'
  } else if (documentCategory === 'notat-personlig') {
    category = 'Notat - personlig'
  }
  return category
}
