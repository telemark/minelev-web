'use strict'

let yffData = {
  programInnhold: [],
  kompetansemaal: []
}

function init () {
  document.getElementById('addPlanSkole').addEventListener('click', (e) => {
    e.preventDefault()
    addSkole()
  })
  document.getElementById('addPlanUB').addEventListener('click', (e) => {
    e.preventDefault()
    addUB()
  })
  document.getElementById('addPlanBedrift').addEventListener('click', (e) => {
    e.preventDefault()
    addBedrift()
  })
  document.getElementById('utdanningsprogramVelger').addEventListener('change', (e) => {
    e.preventDefault()
    const programId = e.target.options[e.target.selectedIndex].value
    getProgramInnhold(programId)
  })
  toggleTable('planUBTable')
  toggleTable('planSkoleTable')
  toggleTable('planBedriftTable')
}

function getProgramInnhold (programId) {
  const url = `/yff/programomrade/${programId}`
  axios.get(url).then(result => {
    console.log(result.data)
    yffData.programInnhold = result.data
    buildProgramOmrader()
  }).catch(error => console.error(error))
}

function getKompetanseMaal (index) {
  yffData.kompetansemaal = yffData.programInnhold[index].kompetansemaal
  buildKompetansemaal()
}

function createKompetansemaalOption (item) {
  const boxId = uuidv4()
  const label = document.createElement('label')
  const checkbox = document.createElement('input')
  const span = document.createElement('span')
  label.classList.add('mdl-checkbox')
  label.classList.add('mdl-js-checkbox')
  label.classList.add('mdl-js-ripple-effect')
  label.classList.add('chxBxordenKompetanse')
  checkbox.classList.add('mdl-checkbox__input')
  span.classList.add('mdl-radio__label')
  span.innerHTML = item.tittel
  checkbox.setAttribute('type', 'checkbox')
  checkbox.setAttribute('id', boxId)
  checkbox.setAttribute('name', 'kompetansemaalvalg')
  checkbox.setAttribute('value', item.tittel)
  label.setAttribute('for', boxId)
  label.appendChild(checkbox)
  label.appendChild(span)
  return label
}

function buildKompetansemaal () {
  const div = document.getElementById('kompetansemaal')
  div.innerHTML = ''
  yffData.kompetansemaal.forEach(item => {
    const option = createKompetansemaalOption(item)
    div.appendChild(option)
  })
}

function createProgramoradeOption(item) {
  const option = document.createElement('option')
  option.innerHTML = item.name
  return option
}

function buildProgramOmrader () {
  const div = document.getElementById('programomrader')
  const select = document.createElement('select')
  const firstOption = createProgramoradeOption({name: 'Velg programområde'})
  select.appendChild(firstOption)
  yffData.programInnhold.forEach(item => {
    const option = createProgramoradeOption(item)
    select.appendChild(option)
  })
  div.appendChild(select)
  select.addEventListener('change', (e) => {
    e.preventDefault()
    const index = e.target.selectedIndex - 1
    if (index >= 0) {
      getKompetanseMaal(index)
    }
  })
}

function cloneKompetanse () {
  const div = document.getElementById('kompetansemaal')
  const clone = div.cloneNode(true)
  return clone
}

function toggleTable (id) {
  const table = document.getElementById(id)
  const heading = document.getElementById(`${id}Heading`)
  const body = table.getElementsByTagName('tbody')[0]
  const trs = body.getElementsByTagName('tr')
  const display = trs.length > 0 ? '' : 'none'
  table.style.display = display
  heading.style.display = display
}

function removeRow (id) {
  const row = document.getElementById(id)
  row.parentNode.removeChild(row)
  toggleTable('planUBTable')
  toggleTable('planSkoleTable')
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
    removeRow(id)
  })
  toggleTable('planUBTable')
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
    removeRow(id)
  })
  toggleTable('planSkoleTable')
}

function addBedrift () {
  const rowId = uuidv4()
  const table = document.getElementById('planBedriftTable')
  const body = table.getElementsByTagName('tbody')[0]
  const tr = document.createElement('tr')
  const kompetanseCelle = document.createElement('td')
  const oppgaveCelle = document.createElement('td')
  const bedriftCelle = document.createElement('td')
  const slettCelle = document.createElement('td')
  const slettButton = document.createElement('button')
  const kompetanse = cloneKompetanse()
  tr.setAttribute('id', rowId)
  slettButton.setAttribute('id', `slett${rowId}`)
  slettButton.innerHTML = 'Slett'
  slettButton.classList.add('mdl-button')
  slettButton.classList.add('mdl-js-button')
  slettButton.classList.add('mdl-button--raised')
  slettButton.classList.add('mdl-js-ripple-effect')
  oppgaveCelle.classList.add('mdl-data-table__cell--non-numeric')
  oppgaveCelle.appendChild(createInput('arbeidsoppgaver'))
  kompetanseCelle.classList.add('mdl-data-table__cell--non-numeric')
  kompetanse.childNodes.forEach(child => kompetanseCelle.appendChild(child))
  bedriftCelle.classList.add('mdl-data-table__cell--non-numeric')
  bedriftCelle.appendChild(createInput('bedrift'))
  slettCelle.classList.add('mdl-data-table__cell--non-numeric')
  slettCelle.appendChild(slettButton)
  tr.appendChild(kompetanseCelle)
  tr.appendChild(oppgaveCelle)
  tr.appendChild(bedriftCelle)
  tr.appendChild(slettCelle)

  body.appendChild(tr)

  document.getElementById(`slett${rowId}`).addEventListener('click', (e) => {
    e.preventDefault()
    const id = e.target.id.replace('slett', '')
    document.getElementById(e.target.id).removeEventListener('click', (e) => console.log('removed'))
    removeRow(id)
  })
  toggleTable('planBedriftTable')
}

function duplicateRow (id) {
  const rowId = uuidv4()
  const table = document.getElementById(id)
  const body = table.getElementsByTagName('tbody')[0]
  const tr = body.getElementsByTagName('tr')[0]
  const newRow = tr.cloneNode(true)
  const cells = newRow.getElementsByTagName('td')
  const slettCelle = document.createElement('td')
  const slettButton = document.createElement('button')
  const lastCell = cells[cells.length - 1]

  newRow.setAttribute('id', rowId)
  slettButton.setAttribute('id', `slett${rowId}`)
  slettButton.innerHTML = 'Slett'
  slettButton.classList.add('mdl-button')
  slettButton.classList.add('mdl-js-button')
  slettButton.classList.add('mdl-button--raised')
  slettButton.classList.add('mdl-js-ripple-effect')
  slettCelle.classList.add('mdl-data-table__cell--non-numeric')
  slettCelle.appendChild(slettButton)

  newRow.replaceChild(slettCelle, lastCell)

  body.appendChild(newRow)

  document.getElementById(`slett${rowId}`).addEventListener('click', (e) => {
    e.preventDefault()
    const id = e.target.id.replace('slett', '')
    document.getElementById(e.target.id).removeEventListener('click', (e) => console.log('removed'))
    removeRow(id)
  })
}

function ready (fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(init)
