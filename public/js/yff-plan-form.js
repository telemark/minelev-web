'use strict'

let yffData = {
  programInnhold: [],
  kompetansemaal: []
}

function updateProgramInnhold (e) {
  e.preventDefault()
  const utdanningsprogramVelger = document.getElementById('utdanningsprogramVelger')
  const klassetrinnVelger = document.getElementById('klassetrinnVelger')
  const programId = utdanningsprogramVelger.options[utdanningsprogramVelger.selectedIndex].value
  const klassetrinn = klassetrinnVelger.options[klassetrinnVelger.selectedIndex].value
  getProgramInnhold({programId: programId, klassetrinn: klassetrinn})
}

function init () {
  const maalButtons = document.querySelectorAll('.kompetanseMaalButton')
  hideVelger('utplasseringsVelger')
  hideVelger('innholdsVelger')
  hideVelger('submitVelger')
  addListener(document.getElementById('utdanningsprogramVelger'), 'change', updateProgramInnhold)
  addListener(document.getElementById('klassetrinnVelger'), 'change', updateProgramInnhold)
  maalButtons.forEach(button => addListener(button, 'click', deleteKompetanseMaal))
}

//MDL Text Input Cleanup
function mdlCleanUp () {
  let mdlInputs = document.querySelectorAll('.mdl-js-textfield')
  for (let i = 0, l = mdlInputs.length; i < l; i++) {
    mdlInputs[i].MaterialTextfield.checkDirty()
  }
}

function getProgramInnhold (options) {
  const url = `https://yff.service.minelev.no/utdanningsprogrammer/${options.programId}-${options.klassetrinn}`
  axios.get(url).then(result => {
    yffData.programInnhold = result.data
    buildProgramOmrader()
  }).catch(error => console.error(error))
}

function getKompetanseMaal (index) {
  yffData.kompetansemaal = yffData.programInnhold[index].kompetansemaal
  buildKompetansemaal()
  showVelger('utplasseringsVelger')
  addListener(document.getElementById('utplasseringsstedVelger'), 'change', buildArbeidsoppghaver)
}

function addListener (element, type, func) {
  element.removeEventListener(type, func)
  element.addEventListener(type, func)
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
  const maal = document.getElementById('kompetansemaal')
  maal.innerHTML = ''
  let select = document.getElementById('programomradeSelector')
  if (select !== null) {
    select.innerHTML = ''
  } else {
    select = document.createElement('select')
    select.setAttribute('id', 'programomradeSelector')
  }
  const firstOption = createProgramoradeOption({name: 'Velg programområde'})
  select.classList.add('margin-top-10')
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

function buildArbeidsoppghaver (e) {
  e.preventDefault()
  const div = document.getElementById('innhold')
  const br = document.createElement('br')
  div.appendChild(createInput({name: 'arbeidsoppgaver', text: 'Arbeidsoppgaver'}))
  div.appendChild(br)
  div.appendChild(createInput({name: 'sted', text: 'Navn på utplasseringssted'}))
  showVelger('innholdsVelger')
  showVelger('submitVelger')
}

function cloneKompetanse () {
  const parent = document.getElementById('kompetansemaal')
  const clone = parent.cloneNode(true)
  const div = document.createElement('div')
  clone.childNodes.forEach(child => {
    const inputs = child.getElementsByTagName('input')
    if (input[0].checked) {
      div.appendChild(child)
    }
    console.log(inputs)
  })
  return div
}

function hideVelger (velger) {
  const velgers = document.querySelectorAll(`.${velger}`)
  velgers.forEach(item => item.style.display = 'none')
}

function showVelger (velger) {
  const velgers = document.querySelectorAll(`.${velger}`)
  velgers.forEach(item => item.style.display = '')
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

function removeTableRow (id) {
  const row = document.getElementById(id)
  row.parentNode.removeChild(row)
}

function hideTableRow (id) {
  const row = document.getElementById(id)
  row.style.display = 'none'
}

function showTableRow (id) {
  const row = document.getElementById(id)
  row.style.display = ''
}

async function deleteKompetanseMaal (e) {
  e.preventDefault()
  if (confirm(`${e.target.title}?`)) {
    console.log('Skal slettes')
    const id = e.target.dataset.id
    const url = e.target.href
    hideTableRow(id)
    const { data } = await axios(url)
    if (data.success === true) {
      removeTableRow(id)
    } else {
      showTableRow(id)
    }
  } else {
    return false
  }
}

function createInput (options) {
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
  input.setAttribute('name', options.name)
  label.setAttribute('for', id)
  label.innerHTML = options.text
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
  programCelle.appendChild(createInput({name: 'program', text: ''}))
  produksjonsCelle.classList.add('mdl-data-table__cell--non-numeric')
  produksjonsCelle.appendChild(createInput({name: 'produksjon', text: ''}))
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
  programCelle.appendChild(createInput({name: 'program', text: ''}))
  kompetanseCelle.classList.add('mdl-data-table__cell--non-numeric')
  kompetanseCelle.appendChild(createInput({name: 'kompetanse', text: ''}))
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
  const infoDiv = document.createElement('div')
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
  infoDiv.appendChild(createInput({name: 'arbeidsoppgaver', text: 'Arbeidsoppgaver'}))
  infoDiv.appendChild(createInput({name: 'bedrift', text: 'Bedrift'}))
  kompetanseCelle.classList.add('mdl-data-table__cell--non-numeric')
  kompetanseCelle.appendChild(kompetanse)
  kompetanseCelle.appendChild(infoDiv)
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
