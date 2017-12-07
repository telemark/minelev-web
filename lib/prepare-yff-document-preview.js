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

function repackPerson (lines) {
  let kontaktperson = []
  lines.forEach(line => {
    kontaktperson.push(`${line.navn} - telefon: ${line.telefon}${line.avdeling && line.avdeling !== '' ? ' - ' : ''}${line.avdeling || ''}`)
  })
  return kontaktperson.join('\n')
}

function repackTilbakemelding (lines) {
  let tilbakemelding = []
  lines.forEach(line => {
    if (/0/.test(line.score) !== true) {
      tilbakemelding.push(`${line.name} - ${line.score}`)
    }
  })
  return tilbakemelding.join('\n')
}

function repackArbeidstid (data) {
  let arbeidstid = []
  arbeidstid.push(`Tidsrom: ${data.startDato} - ${data.sluttDato}`)
  arbeidstid.push(`Arbeidsdag: ${data.startTid} - ${data.sluttTid}`)
  arbeidstid.push(`Dager i uken: ${data.daysPerWeek}`)
  if (data.oppmotested !== '') {
    arbeidstid.push(`Oppmøtested: ${data.oppmotested}`)
  }
  return arbeidstid.join('\n')
}

function repackFravar (data) {
  let fravar = ''
  if (/0/.test(data.fravarDager) !== true || /0/.test(data.fravarTimer) !== true) {
    if (data.varsletFravar === 'ja') {
      fravar = 'Eleven varslet selv om fraværet.'
    } else if (data.varsletFravar === 'nei') {
      fravar = 'Eleven varslet ikke om fraværet.'
    } else if (data.varsletFravar === 'av og til') {
      fravar = 'Eleven varslet selv om noe av fraværet.'
    }
  }
  return fravar
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
    data.paarorendeElev = repackPerson(document.parorendeData)
    data.kontaktBedrift = repackPerson(document.kontaktpersonData)
    data.utplasseringsTidsrom = document.utplasseringsPeriode
    data.navnOpplaeringssted = document.bedriftsNavn
    data.arbeidsTid = repackArbeidstid(document.utplasseringData)
  }

  if (document.documentCategory === 'yff-tilbakemelding') {
    data.klasseTrinn = document.classLevel
    data.utdanningsProgram = document.utdanningsprogram
    data.utplasseringsTidsrom = document.utplasseringsPeriode
    data.navnOpplaeringssted = document.bedriftsNavn
    data.tilbakemeldingKompetansemaal = repackTilbakemelding(document.maal)
    data.tilbakemeldingInntrykk = repackTilbakemelding(document.evaluation)
    data.fravaerAntallDager = document.fravarDager
    data.fravaerAntallTimer = document.fravarTimer
    data.fravaerVarsling = repackFravar(document)
  }

  if (document.documentCategory === 'yff-lokalplan') {
    data.klasseTrinn = document.classLevel
    data.utdanningsProgram = document.utdanningsprogram
    data.fodselsNummerElev = document.studentId
    data.lokalLaereplan = repackLareplan(buildLareplan(document.lokalPlanMaal))
  }

  return data
}
