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

function repackParorende (lines) {
  let parorende = []
  lines.forEach(line => {
    parorende.push(`${line.navn} - telefon: ${line.telefon}`)
  })

  return parorende.join('\n')
}

function repackKontaktperson (lines) {
  let kontaktperson = []
  lines.forEach(line => {
    kontaktperson.push(`${line.navn} - telefon: ${line.telefon}${line.avdeling !== '' ? ' - ' : ''}${line.avdeling}`)
  })
  return kontaktperson.join('\n')
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
    data.navnMottaker = document.studentName
    data.paarorendeElev = repackParorende(document.parorendeData)
    data.kontaktBedrift = repackKontaktperson(document.kontaktpersonData)
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
    data.klasseTrinn = document.classLevel
    data.utdanningsProgram = document.utdanningsprogram
    data.fodselsNummerElev = document.studentId
    data.lokalLaereplan = repackLareplan(buildLareplan(document.lokalPlanMaal))
  }

  return data
}
