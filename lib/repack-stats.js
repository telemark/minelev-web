const formatDocumentCategory = require('./format-document-category')
const features = require('../config/features')

module.exports = data => {
  let stats = []

  if (data.totalVarsel && data.totalVarsel.total) {
    stats.push({name: 'Totalt antall varselbrev', count: data.totalVarsel.total || 0})
  } else {
    stats.push({name: 'Totalt antall varselbrev', count: 0})
  }

  if (data.totalSamtale && data.totalSamtale.total) {
    stats.push({name: 'Totalt antall dokumenterte elevsamtaler', count: data.totalSamtale.total || 0})
  } else {
    stats.push({name: 'Totalt antall dokumenterte elevsamtaler', count: 0})
  }

  if (features.useYFF !== false) {
    if (data.totalBekreftelse && data.totalBekreftelse.total) {
      stats.push({name: 'Totalt antall utplasseringer', count: data.totalBekreftelse.total || 0})
    } else {
      stats.push({name: 'Totalt antall utplasseringer', count: 0})
    }

    if (data.totalTilbakemelding && data.totalTilbakemelding.total) {
      stats.push({name: 'Totalt antall tilbakemeldinger', count: data.totalTilbakemelding.total || 0})
    } else {
      stats.push({name: 'Totalt antall tilbakemeldinger', count: 0})
    }

    if (data.totalLokalplan && data.totalLokalplan.total) {
      stats.push({name: 'Totalt antall lokale læreplaner arkivert', count: data.totalLokalplan.total || 0})
    } else {
      stats.push({name: 'Totalt antall lokale læreplaner arkivert', count: 0})
    }
  }

  if (data.categories && Array.isArray(data.categories)) {
    stats.push({name: 'Inndeling etter dokumenttyper', count: ''})
    data.categories.forEach(item => {
      if (item._id !== null) {
        stats.push({name: `${formatDocumentCategory(item._id)}`, count: item.total})
      }
    })
  }

  if (data.schoolsVarsel && Array.isArray(data.schoolsVarsel)) {
    if (data.schoolsVarsel.length > 0) {
      stats.push({name: 'Varsler fordelt pr skole', count: ''})
    }
    data.schoolsVarsel.forEach(item => {
      if (item._id !== null) {
        stats.push({name: item._id, count: item.total})
      }
    })
  }

  if (data.schoolsSamtale && Array.isArray(data.schoolsSamtale)) {
    if (data.schoolsSamtale.length > 0) {
      stats.push({name: 'Samtaler fordelt pr skole', count: ''})
    }
    data.schoolsSamtale.forEach(item => {
      if (item._id !== null) {
        stats.push({name: item._id, count: item.total})
      }
    })
  }
  return stats
}
