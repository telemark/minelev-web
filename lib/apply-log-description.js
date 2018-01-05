module.exports = logs => {
  function logDescription (log) {
    let descriptions = []
    if (log.gradesCategories && log.gradesCategories !== '') {
      descriptions.push(log.gradesCategories)
    }
    if (log.orderCategories && log.orderCategories !== '') {
      descriptions.push(log.orderCategories)
    }
    if (log.behaviourCategories && log.behaviourCategories !== '') {
      descriptions.push(log.behaviourCategories)
    }
    if (log.samtaleCategories && log.samtaleCategories !== '') {
      descriptions.push(log.samtaleCategories)
    }
    if (log.evaluation && Array.isArray(log.evaluation) && log.evaluation.length > 0) {
      log.evaluation.forEach(e => {
        descriptions.push(`${e.name} - ${e.score}`)
      })
    }
    if (log.maal && Array.isArray(log.maal) && log.maal.length > 0) {
      descriptions.push('')
      log.maal.forEach(m => {
        descriptions.push(`Kompetansemål: ${m.name}`)
        if (m.description && m.description !== '') {
          descriptions.push(`Arbeidsoppgaver: ${m.description}`)
        }
        descriptions.push(`Måloppnåelse: ${m.score}`)
        descriptions.push('')
      })
    }
    if (log.lokalPlanMaal && Array.isArray(log.lokalPlanMaal) && log.maal.lokalPlanMaal > 0) {
      log.lokalPlanMaal.forEach(plan => {
        descriptions.push(`Kompetansemål: ${plan.kompetanseMaal}`)
        if (plan.arbeidsOppgaver && plan.arbeidsOppgaver !== '') {
          descriptions.push(`Arbeidsoppgaver: ${plan.arbeidsOppgaver}`)
        }
      })
    }
    if (log.documentCategory === 'yff-bekreftelse') {
      if (log.bedriftsData && log.bedriftsData.navn) {
        descriptions.push(log.bedriftsData.navn)
      }
      if (log.utplasseringsPeriode) {
        descriptions.push(log.utplasseringsPeriode)
      }
      if (log.utplasseringData) {
        descriptions.push(`Dager pr uke: ${log.utplasseringData.daysPerWeek}`)
        descriptions.push(`Arbeidstid: ${log.utplasseringData.startTid} - ${log.utplasseringData.sluttTid}`)
        if (log.utplasseringData.oppmotested && log.utplasseringData.oppmotested !== '') {
          descriptions.push(`Oppmøtested: ${log.utplasseringData.oppmotested}`)
        }
        descriptions.push('')
      }
      if (log.kontaktpersonData && Array.isArray(log.kontaktpersonData)) {
        descriptions.push('Kontaktpersoner')
        log.kontaktpersonData.forEach(person => {
          descriptions.push(`Navn: ${person.navn}`)
          descriptions.push(`Telefon: ${person.telefon}`)
          if (person.avdeling && person.avdeling !== '') {
            descriptions.push(`Avdeling: ${person.avdeling}`)
          }
          descriptions.push('')
        })
      }
    }
    return descriptions.join('\n')
  }

  return logs.map(log => Object.assign({}, log, {logDescription: logDescription(log)}))
}
