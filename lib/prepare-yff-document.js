'use strict'

module.exports = data => {
  let document = {}
  if (data.type && data.type === 'yff-informasjonsskriv') {
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
    document.kontaktpersonData = [
      {
        navn: data.kontaktpersonNavn,
        telefon: data.kontaktpersonTelefon,
        avdeling: data.kontaktpersonAvdeling
      }
    ]
    document.parorendeData = [
      {
        navn: data.parorendeNavn,
        telefon: data.parorendeTelefon
      }
    ]
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
