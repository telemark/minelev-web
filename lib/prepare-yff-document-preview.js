const getSkoleAar = require('get-skole-aar')
const datePadding = require('./date-padding')
const birthdateFromId = require('./birthdate-from-id')
const buildLareplan = require('./yff-build-lareplan')

function repackLareplan (lines) {
  let plans = []
  lines.forEach(line => {
    plans.push(`${line.utplasseringsSted}`)
    line.line.forEach(l => {
      plans.push(`${l.kompetanseMaal} - ${l.arbeidsOppgaver}`)
    })
  })
  return plans.join('\n')
}

module.exports = document => {
  const now = new Date()
  const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
  let data = {
    dato: date,
    navnElev: document.studentName,
    epostElev: document.studentMail,
    tlfElev: document.studentPhone,
    fodselsdatoElev: birthdateFromId(document.studentId),
    navnLaerer: document.userName,
    navnSkole: document.schoolName,
    tlfSkole: document.schoolPhone,
    epostLaerer: document.userMail,
    skoleAar: getSkoleAar()
  }

  if (document.documentCategory === 'yff-informasjonsskriv') {
    data.klasseTrinn = document.classLevel
    data.utdanningsProgram = document.utdanningsprogram
    data.navnMottaker = 'MottakerInfo'
    data.paarorendeElev = 'Pårørendeinfo'
    data.kontaktBedrift = 'Kontaktpersoninfo'
    data.utplasseringsTidsrom = document.utplasseringsPeriode
    data.navnOpplaeringssted = document.bedriftsNavn
    data.arbeidsTid = `${document.utplasseringData.startTid} - ${document.utplasseringData.sluttTid}`
  }

  if (document.documentCategory === 'yff-tilbakemelding') {
    data.klasseTrinn = document.classLevel
    data.utdanningsProgram = document.utdanningsprogram
    data.utplasseringsTidsrom = 'Utplasseringstidsrom'
    data.navnOpplaeringssted = 'Opplæringsstedets navn'
    data.tilbakemeldingKompetansemaal = 'Tilbakemeldinger kompetansemål'
    data.tilbakemeldingInntrykk = 'Tilbakemeldinger inntrykk'
    data.fravaerAntallDager = 'Antall fraværsdager'
    data.fravaerAntallTimer = 'Antall fraværstimer'
    data.fravaerVarsling = 'Varslet eleven om fraværet'
  }

  if (document.documentCategory === 'yff-lokalplan') {
    data.klasseTrinn = 'Elevens klassetrinn'
    data.utdanningsProgram = 'Elevens utdanningsprogram'
    data.fodselsNummerElev = document.studentId
    data.lokalLaereplan = repackLareplan(buildLareplan(document.lokalPlanMaal))
  }

  return data
}
