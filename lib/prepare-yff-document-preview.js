const getSkoleAar = require('get-skole-aar')
const datePadding = require('./date-padding')
const birthdateFromId = require('./birthdate-from-id')
const buildLareplan = require('./yff-build-lareplan')
const toNynorsk = require('./to-nynorsk')

function repackLareplan (lines) {
  const plans = []
  lines.forEach(line => {
    plans.push(`\n${line.utplasseringsSted}`)
    line.line.forEach(l => {
      plans.push(`\nProgramområde: ${l.programomrade}\nKompetansemål: ${l.kompetanseMaal}\nArbeidsoppgaver: ${l.arbeidsOppgaver}`)
    })
  })
  return plans.join('\n')
}

function repackPerson (lines) {
  const kontaktperson = []
  lines.forEach(line => {
    kontaktperson.push(`${line.navn} - telefon: ${line.telefon}${line.epost && line.epost !== '' ? ' - e-post: ' : ''}${line.epost || ''}${line.avdeling && line.avdeling !== '' ? ' - ' : ''}${line.avdeling || ''}`)
  })
  return kontaktperson.join('\n')
}

function checkCopyTo (data) {
  const emails = data.kopiPrEpost.split(' ').filter(line => line !== '')
  return emails.length > 0 ? `Kopi sendt via e-post til ${emails.join(', ')}` : ''
}

function repackTilbakemelding (lines) {
  const tilbakemelding = []
  lines.forEach(line => {
    if (/0/.test(line.score) !== true) {
      if (Object.prototype.hasOwnProperty.call(line, 'description')) {
        if (line.description) {
          tilbakemelding.push(`Kompetansemål: ${line.name}\nArbeidsoppgaver: ${line.description}\nMåloppnåelse: ${line.score}\n`)
        } else {
          tilbakemelding.push(`Kompetansemål: ${line.name}\nMåloppnåelse: ${line.score}\n`)
        }
      } else {
        tilbakemelding.push(`${line.name} - ${line.score}`)
      }
    }
  })
  return tilbakemelding.join('\n')
}

function repackArbeidstid (data) {
  const arbeidstid = []
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
  const data = {
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

  if (document.documentCategory === 'yff-bekreftelse') {
    data.klasseTrinn = document.classLevel.toLowerCase()
    if (document.programomrade !== '' && document.classLevel === 'VG2') {
      data.utdanningsProgram = document.programomrade
    } else {
      data.utdanningsProgram = document.utdanningsprogram
    }
    data.navnMottaker = document.studentName
    data.paarorendeElev = repackPerson(document.parorendeData)
    data.kontaktBedrift = repackPerson(document.kontaktpersonData)
    data.kopiTilEpost = checkCopyTo(document)
    data.utplasseringsTidsrom = document.utplasseringsPeriode
    data.navnOpplaeringssted = document.bedriftsNavn
    data.arbeidsTid = repackArbeidstid(document.utplasseringData)
  }

  if (document.documentCategory === 'yff-tilbakemelding') {
    const tilbakemeldingInntrykk = repackTilbakemelding(document.evaluation)
    const tilbakemeldingInntrykkNN = toNynorsk(tilbakemeldingInntrykk)
    data.klasseTrinn = document.classLevel.toLowerCase()
    data.utdanningsProgram = document.utdanningsprogram
    data.utplasseringsTidsrom = document.utplasseringsPeriode
    data.navnOpplaeringssted = document.bedriftsNavn
    data.tilbakemeldingKompetansemaal = repackTilbakemelding(document.maal)
    data.tilbakemeldingInntrykk = tilbakemeldingInntrykk
    data.tilbakemeldingInntrykkNN = tilbakemeldingInntrykkNN
    data.fravaerAntallDager = document.fravarDager
    data.fravaerAntallTimer = document.fravarTimer
    data.fravaerVarsling = repackFravar(document)
  }

  if (document.documentCategory === 'yff-lokalplan') {
    data.klasseTrinn = document.classLevel.toLowerCase()
    data.utdanningsProgram = document.utdanningsprogram
    data.fodselsNummerElev = document.studentId
    data.lokalLaereplan = repackLareplan(buildLareplan(document.lokalPlanMaal))
  }

  return data
}
