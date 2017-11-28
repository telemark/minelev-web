const getSkoleAar = require('get-skole-aar')
const datePadding = require('./date-padding')

module.exports = document => {
  const now = new Date()
  const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
  let data = {
    dato: date,
    navnElev: document.studentName,
    klasseTrinn: 'Klassetrinn elev',
    fodselsdatoElev: 'Fødselsdato elev',
    utdanningsProgram: 'Utdanningsprogram elev',
    navnLaerer: document.userName,
    navnSkole: document.schoolName,
    tlfSkole: document.schoolPhone,
    epostSkole: document.schoolEmail,
    skoleAar: getSkoleAar()
  }

  if (document.documentCategory === 'yff-informasjonsskriv') {
    data.paaarorende = 'Pårørendeinfo'
    data.kontakt = 'Kontaktpersoninfo'
    data.utplasseringTidsrom = 'Utplasseringstidsrom'
    data.navnOpplaringssted = 'Opplæringsstedets navn'
    data.arbeidsTid = 'Opplæringsstedets navn'
  }

  if (document.documentCategory === 'yff-tilbakemelding') {
    data.utplasseringTidsrom = 'Utplasseringstidsrom'
    data.navnOpplaringssted = 'Opplæringsstedets navn'
    data.tilbakemeldingKompetansemaal = 'Tilbakemeldinger kompetansemål'
    data.tilbakemeldingInntrykk = 'Tilbakemeldinger inntrykk'
    data.fravarAntallDager = 'Antall fraværsdager'
    data.fravarAntallTimer = 'Antall fraværstimer'
    data.fravarVarsling = 'Varslet eleven om fraværet'
  }

  if (document.documentCategory === 'yff-lokalplan') {
    data.fodselsnummerElev = 'Elevens fødselsnummer'
    data.lokalLaereplan = 'Elevens lokale læreplan'
  }

  return data
}
