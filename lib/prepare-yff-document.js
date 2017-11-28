const arrify = require('arrify')

module.exports = data => {
  let document = {}
  if (data.type && data.type === 'yff-informasjonsskriv') {
    document.classLevel = data.classLevel
    document.utdanningsprogram = data.utdanningsprogram
    data.kontaktpersonNavn = arrify(data.kontaktpersonNavn)
    data.kontaktpersonTelefon = arrify(data.kontaktpersonTelefon)
    data.kontaktpersonAvdeling = arrify(data.kontaktpersonAvdeling)
    data.parorendeNavn = arrify(data.parorendeNavn)
    data.parorendeTelefon = arrify(data.parorendeTelefon)
    document.bedriftsNavn = data.organisasjonsNavn
    document.utplasseringsPeriode = `${data.startDato} - ${data.sluttDato}`
    document.bedriftsData = {
      organisasjonsNummer: data.organisasjonsNummer,
      navn: data.organisasjonsNavn,
      adresse: data.organisasjonsAdresse,
      postnummer: data.organisasjonsPostnummer,
      poststed: data.organisasjonsPoststed,
      avdeling: data.organisasjonsAvdeling
    }
    document.kontaktpersonData = data.kontaktpersonNavn.map((name, index) => Object.assign({navn: name, telefon: data.kontaktpersonTelefon[index], avdeling: data.kontaktpersonAvdeling[index]}))
    document.parorendeData = data.parorendeNavn.map((name, index) => Object.assign({navn: name, telefon: data.parorendeTelefon[index]}))
    document.utplasseringData = {
      startDato: data.startDato,
      sluttDato: data.sluttDato,
      daysPerWeek: data.daysPerWeek,
      startTid: data.startTid,
      sluttTid: data.sluttTid,
      oppmotested: data.oppmotested
    }
  }
  if (data.type && data.type === 'yff-lokalplan-maal') {
    document.arbeidsoppgaver = data.arbeidsoppgaver || ''
    document.utplasseringstype = data.utplasseringsstedvelger
    document.programomrade = data.programomrade
    if (document.utplasseringstype === 'bedrift') {
      document.utplasseringID = data.bedriftID
      document.utplasseringsSted = data[`${data.bedriftID}-bedriftsNavn`]
      document.period = data[`${data.bedriftID}-bedriftsPeriode`]
    } else if (document.utplasseringstype === 'skole') {
      document.utplasseringID = data.skoleID
      document.utplasseringsSted = data[`${data.skoleID}-skoleNavn`]
    } else {
      document.utplasseringID = ''
      document.utplasseringsSted = data.UBNavn
    }
  }
  if (data.type && data.type === 'yff-tilbakemelding') {
    const maal = Object.keys(data).reduce((previous, current) => {
      if (current.startsWith('kompetansemaal-')) {
        const maalId = current.replace('kompetansemaal-', '')
        previous.push({
          id: maalId,
          name: data[`kompetanse-${maalId}`],
          score: data[current]
        })
      }
      return previous
    }, [])
    const evaluation = Object.keys(data).reduce((previous, current) => {
      if (current.startsWith('evaluationscore-')) {
        const evaluationId = current.replace('evaluationscore-', '')
        previous.push({
          id: evaluationId,
          name: data[`evaluation-${evaluationId}`],
          score: data[current]
        })
      }
      return previous
    }, [])
    const bedriftID = data.bedriftID
    document.bedriftID = bedriftID
    document.bedriftsNavn = data[`bedrift-${bedriftID}`]
    document.utplasseringsPeriode = data[`periode-${bedriftID}`]
    document.maal = maal
    document.evaluation = evaluation
    document.fravarDager = data.fravarDager
    document.fravarTimer = data.fravarTimer
    document.varsletFravar = data.varsletFravar
  }
  return document
}
