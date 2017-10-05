'use strict'

function init () {
  document.getElementById('addPlanSkole').addEventListener('click', (e) => {
    e.preventDefault()
    addSkole()
  })
  document.getElementById('addPlanUB').addEventListener('click', (e) => {
    e.preventDefault()
    addUB()
  })
  toggleTable('planUBTable')
  toggleTable('planSkoleTable')
}

function toggleTable (id) {
  const table = document.getElementById(id)
  const body = table.getElementsByTagName('tbody')[0]
  const trs = body.getElementsByTagName('tr')
  table.style.display = trs.length > 0 ? '' : 'none'
}

function createInput (name) {
  const id = new Date().getMilliseconds()
  const div = document.createElement('div')
  const input = document.createElement('input')
  const label = document.createElement('label')
  div.classList.add('mdl-textfield')
  div.classList.add('mdl-js-textfield')
  div.classList.add('mdl-textfield--floating-label')
  input.classList.add('mdl-textfield__input')
  label.classList.add('mdl-textfield__label')
  input.setAttribute('id', id)
  input.setAttribute('name', name)
  label.setAttribute('for', id)
  div.appendChild(input)
  div.appendChild(label)
  return div
}

function removeUBRow (id) {
  const row = document.getElementById(id)
  row.parentNode.removeChild(row)
  toggleTable('planUBTable')
}

function addUB () {
  const rowId = uuidv4()
  const table = document.getElementById('planUBTable')
  const body = table.getElementsByTagName('tbody')[0]
  const tr = document.createElement('tr')
  const programCelle = document.createElement('td')
  const produksjonsCelle = document.createElement('td')
  const slettCelle = document.createElement('td')
  const slettButton = document.createElement('button')

  tr.setAttribute('id', rowId)
  slettButton.setAttribute('id', `slett${rowId}`)
  slettButton.innerHTML = 'Slett'
  slettButton.classList.add('mdl-button')
  slettButton.classList.add('mdl-js-button')
  slettButton.classList.add('mdl-button--raised')
  slettButton.classList.add('mdl-js-ripple-effect')
  programCelle.classList.add('mdl-data-table__cell--non-numeric')
  programCelle.appendChild(createInput('program'))
  produksjonsCelle.classList.add('mdl-data-table__cell--non-numeric')
  produksjonsCelle.appendChild(createInput('produksjon'))
  slettCelle.classList.add('mdl-data-table__cell--non-numeric')
  slettCelle.appendChild(slettButton)
  tr.appendChild(programCelle)
  tr.appendChild(produksjonsCelle)
  tr.appendChild(slettCelle)

  body.appendChild(tr)

  document.getElementById(`slett${rowId}`).addEventListener('click', (e) => {
    e.preventDefault()
    const id = e.target.id.replace('slett', '')
    document.getElementById(e.target.id).removeEventListener('click', (e) => console.log('removed'))
    removeUBRow(id)
  })
  toggleTable('planUBTable')
}

function removeSkoleRow (id) {
  const row = document.getElementById(id)
  row.parentNode.removeChild(row)
  toggleTable('planSkoleTable')
}

function addSkole () {
  const rowId = uuidv4()
  const table = document.getElementById('planSkoleTable')
  const body = table.getElementsByTagName('tbody')[0]
  const tr = document.createElement('tr')
  const programCelle = document.createElement('td')
  const kompetanseCelle = document.createElement('td')
  const skoleCelle = document.createElement('td')
  const slettCelle = document.createElement('td')
  const slettButton = document.createElement('button')

  tr.setAttribute('id', rowId)
  slettButton.setAttribute('id', `slett${rowId}`)
  slettButton.innerHTML = 'Slett'
  slettButton.classList.add('mdl-button')
  slettButton.classList.add('mdl-js-button')
  slettButton.classList.add('mdl-button--raised')
  slettButton.classList.add('mdl-js-ripple-effect')
  programCelle.classList.add('mdl-data-table__cell--non-numeric')
  programCelle.appendChild(createInput('program'))
  kompetanseCelle.classList.add('mdl-data-table__cell--non-numeric')
  kompetanseCelle.appendChild(createInput('kompetanse'))
  skoleCelle.classList.add('mdl-data-table__cell--non-numeric')
  skoleCelle.appendChild(createInput('skole'))
  slettCelle.classList.add('mdl-data-table__cell--non-numeric')
  slettCelle.appendChild(slettButton)
  tr.appendChild(programCelle)
  tr.appendChild(kompetanseCelle)
  tr.appendChild(skoleCelle)
  tr.appendChild(slettCelle)

  body.appendChild(tr)

  document.getElementById(`slett${rowId}`).addEventListener('click', (e) => {
    e.preventDefault()
    const id = e.target.id.replace('slett', '')
    document.getElementById(e.target.id).removeEventListener('click', (e) => console.log('removed'))
    removeSkoleRow(id)
  })
  toggleTable('planSkoleTable')
}

function ready (fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(init)
