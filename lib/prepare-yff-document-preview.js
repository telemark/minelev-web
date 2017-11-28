const getSkoleAar = require('get-skole-aar')
const datePadding = require('./date-padding')

module.exports = document => {
  const now = new Date()
  const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
  let data = {
    dato: date,
    navnElev: document.studentName,
    epostElev: document.studentMail,
    tlfElev: document.studentPhone,
    klasseTrinn: 'Klassetrinn elev',
    fodselsdatoElev: 'Fødselsdato elev',
    utdanningsProgram: 'Utdanningsprogram elev',
    navnLaerer: document.userName,
    navnSkole: document.schoolName,
    tlfSkole: document.schoolPhone,
    epostSkole: 'epostSkole',
    epostLaerer: document.userMail,
    skoleAar: getSkoleAar()
  }

  if (document.documentCategory === 'yff-informasjonsskriv') {
    data.navnMottaker = 'MottakerInfo'
    data.paarorendeElev = 'Pårørendeinfo'
    data.kontaktBedrift = 'Kontaktpersoninfo'
    data.utplasseringsTidsrom = 'Utplasseringstidsrom'
    data.navnOpplaeringssted = 'Opplæringsstedets navn'
    data.arbeidsTid = 'Opplæringsstedets navn'
  }

  if (document.documentCategory === 'yff-tilbakemelding') {
    data.utplasseringsTidsrom = 'Utplasseringstidsrom'
    data.navnOpplaeringssted = 'Opplæringsstedets navn'
    data.tilbakemeldingKompetansemaal = 'Tilbakemeldinger kompetansemål'
    data.tilbakemeldingInntrykk = 'Tilbakemeldinger inntrykk'
    data.fravaerAntallDager = 'Antall fraværsdager'
    data.fravaerAntallTimer = 'Antall fraværstimer'
    data.fravaerVarsling = 'Varslet eleven om fraværet'
  }

  if (document.documentCategory === 'yff-lokalplan') {
    data.fodselsNummerElev = 'Elevens fødselsnummer'
    data.lokalLaereplan = 'Elevens lokale læreplan'
  }

  return data
}
