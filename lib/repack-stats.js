'use strict'

module.exports = data => {
  let stats = []

  if (data.totalVarsel && data.totalVarsel.total) {
    stats.push({name: 'Totalt antall varsler', count: data.total.total || 0})
  } else {
    stats.push({name: 'Totalt antall varsler', count: 0})
  }

  if (data.totalSamtale && data.totalSamtale.total) {
    stats.push({name: 'Totalt antall samtaler', count: data.total.total || 0})
  } else {
    stats.push({name: 'Totalt antall samtaler', count: 0})
  }

  if (data.categories && Array.isArray(data.categories)) {
    data.categories.forEach(item => {
      if (item._id !== null) {
        stats.push({name: `Dokumenter av type ${item._id}`, count: item.total})
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
