'use strict'

function arrify (input) {
  return Array.isArray(input) ? input : [input]
}

module.exports = data => {
  let document = {}
  if (data.type && data.type === 'yff-informasjonsskriv') {
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
  return document
}
