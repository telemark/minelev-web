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
  hideVelger('utplasseringBedriftVelger')
  hideVelger('utplasseringSkoleVelger')
  hideVelger('utplasseringUBVelger')
  hideVelger('innholdsVelger')
  hideVelger('kompetanseMaalVelger')
  hideVelger('submitVelger')
  addListener(document.getElementById('utplasseringsstedVelger'), 'change', buildArbeidsoppghaver)
  addListener(document.getElementById('utdanningsprogramVelger'), 'change', updateProgramInnhold)
  addListener(document.getElementById('klassetrinnVelger'), 'change', updateProgramInnhold)
  maalButtons.forEach(button => addListener(button, 'click', deleteKompetanseMaal))
}

function validateDocumentForm () {
  const previewButton = document.getElementById('previewDocumentButton')
  previewButton.disabled = false
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
  label.classList.add('hoverGrey')
  label.classList.add('margin-bottom-10')
  checkbox.classList.add('mdl-checkbox__input')
  span.classList.add('mdl-radio__label')
  span.classList.add('capitalFirstLetter')
  span.classList.add('fontBigger')
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
    addListener(option, 'change', toggleArbeidsOppgave)
  })
  showVelger('submitVelger')
}

function toggleArbeidsOppgave (e) {
  e.preventDefault()
  const optionID = e.target.id
  const optionValue = e.target.value
  const optionStatus = e.target.checked
  const innhold = document.getElementById('innhold')

  if (optionStatus === true) {
    const options = {
      wrapperID: `wrapper-${optionID}`,
      name: `arbeidsoppgaver`,
      text: `Arbeidsoppgaver knyttet til ${optionValue}`
    }
    const arbeidsoppgave = createInput(options)
    innhold.appendChild(arbeidsoppgave)
    componentHandler.upgradeElements(innhold)
    showVelger('innholdsVelger')
  } else {
    const arbeidsoppgave = document.getElementById(`wrapper-${optionID}`)
    const parent = arbeidsoppgave.parentNode
    arbeidsoppgave.parentNode.removeChild(arbeidsoppgave, arbeidsoppgave.parentNode)
    if (parent.children.length === 0) {
      hideVelger('innholdsVelger')
    }
  }
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
    select.setAttribute('name', 'programomrade')
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
  const utplasseringssted = e.target.options[e.target.selectedIndex].value
  if (utplasseringssted == 'bedrift') {
    showVelger('utplasseringBedriftVelger')
    hideVelger('utplasseringSkoleVelger')
    hideVelger('utplasseringUBVelger')
  } else if (utplasseringssted == 'skole') {
    showVelger('utplasseringSkoleVelger')
    hideVelger('utplasseringBedriftVelger')
    hideVelger('utplasseringUBVelger')
  } else {
    showVelger('utplasseringUBVelger')
    hideVelger('utplasseringBedriftVelger')
    hideVelger('utplasseringSkoleVelger')
  }
  showVelger('kompetanseMaalVelger')
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
  div.classList.add('width90')
  input.classList.add('mdl-textfield__input')
  label.classList.add('mdl-textfield__label')
  if (options.wrapperID) {
    div.setAttribute('id', options.wrapperID)
  }
  input.setAttribute('id', id)
  input.setAttribute('name', options.name)
  label.setAttribute('for', id)
  label.innerHTML = options.text
  div.appendChild(input)
  div.appendChild(label)
  return div
}

function ready (fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(init)
