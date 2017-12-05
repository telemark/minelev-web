'use strict'

let YFFData = {
  organizations: []
}

function init () {
  const lookupOrganizationButton = document.getElementById('lookupOrganisasjonsButton')
  const bedriftsWrapper = document.getElementById('bedriftsinfoWrapper')
  const lookupField = document.getElementById('brregQuery')
  const lookupForm = document.getElementById('lookupOrganisasjonForm')
  const requiredFields = document.getElementById('submitDocumentForm').querySelectorAll('[required]')
  bedriftsWrapper.style.display = 'none'
  hideVelger('bedriftsVelger')
  hideVelger('lookupMessages')
  addListener(lookupForm, 'submit', lookupOrganization)
  addListener(lookupOrganizationButton, 'click', lookupOrganization)
  requiredFields.forEach(function (field) {
    addListener(field, 'keyup', validateDocumentForm)
  })

  setTimeout(function () {
    lookupField.focus()
  }, 500)

  validateDocumentForm()

  initPreview()
}

function validateDocumentForm () {
  const previewButton = document.getElementById('previewDocumentButton')
  const submitButton = document.getElementById('submitFormButton')
  const requiredFields = document.getElementById('submitDocumentForm').querySelectorAll('[required]')
  let requiredValues = []

  // disable buttons
  submitButton.disabled = true
  previewButton.disabled = true

  requiredFields.forEach(function (field) {
    if (field.value !== '') {
      requiredValues.push(true)
    }
  })

  if (requiredValues.length === requiredFields.length) {
    submitButton.disabled = false
    previewButton.disabled = false
  }
}

function hideVelger (velger) {
  const velgers = document.querySelectorAll('.' + velger)
  velgers.forEach(function (item) {
    item.style.display = 'none'
  })
}

function showVelger (velger) {
  const velgers = document.querySelectorAll('.' + velger)
  velgers.forEach(function (item) {
    item.style.display = ''
  })
}

//MDL Text Input Cleanup
function mdlCleanUp () {
  var mdlInputs = document.querySelectorAll('.mdl-js-textfield');
  for (var i = 0, l = mdlInputs.length; i < l; i++) {
    mdlInputs[i].MaterialTextfield.checkDirty();
  }
}

function spinnerOn () {
  const spinner = document.getElementById('searchIcon')
  const resultDiv = document.getElementById('lookupWrapper')
  resultDiv.innerHTML = ''
  spinner.innerText = 'hourglass_empty'
}

function spinnerOff () {
  const spinner = document.getElementById('searchIcon')
  spinner.innerText = 'search'
}

function setupOrganization (data) {
  const bedriftsNavn = document.getElementById('organisasjonsNavn')
  const bedriftsNummer = document.getElementById('organisasjonsNummer')
  const bedriftsAdresse = document.getElementById('organisasjonsAdresse')
  const bedriftsPostnummer = document.getElementById('organisasjonsPostnummer')
  const bedriftsPoststed = document.getElementById('organisasjonsPoststed')
  const bedriftsWrapper = document.getElementById('bedriftsinfoWrapper')
  // Updates fields
  bedriftsNavn.value = data.navn
  bedriftsNummer.value = data.orgnr
  bedriftsAdresse.value = data.forretningsadr
  bedriftsPostnummer.value = data.forradrpostnr
  bedriftsPoststed.value = data.forradrpoststed
  // Reveal info
  mdlCleanUp()
  bedriftsWrapper.style.display = ''
  hideVelger('bedriftsVelger')
  hideVelger('lookupMessages')
  addListener(document.getElementById('addContactPersonButton'), 'click', addContactPerson)
  addListener(document.getElementById('addNextOfKinButton'), 'click', addNextOfKin)
}

function addListener (element, type, func) {
  element.removeEventListener(type, func)
  element.addEventListener(type, func)
}

function createInput (options) {
  const id = uuidv4()
  const div = document.createElement('div')
  const input = document.createElement('input')
  const label = document.createElement('label')
  div.classList.add('mdl-textfield')
  div.classList.add('mdl-js-textfield')
  div.classList.add('mdl-textfield--floating-label')
  div.classList.add('width90')
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

function addContactPerson (e) {
  e.preventDefault()
  const button = e.target
  const nameField = createInput({name: 'kontaktpersonNavn', text: 'Kontaktperson'})
  const phoneField = createInput({name: 'kontaktpersonTelefon', text: 'Telefon'})
  const departmentField = createInput({name: 'kontaktpersonAvdeling', text: 'Avdeling'})
  button.parentNode.insertBefore(nameField, button)
  button.parentNode.insertBefore(phoneField, button)
  button.parentNode.insertBefore(departmentField, button)
  componentHandler.upgradeElements(button.parentNode)
}

function addNextOfKin (e) {
  e.preventDefault()
  const button = e.target
  const nameField = createInput({name: 'parorendeNavn', text: 'Navn'})
  const phoneField = createInput({name: 'parorendeTelefon', text: 'Telefon'})
  button.parentNode.insertBefore(nameField, button)
  button.parentNode.insertBefore(phoneField, button)
  componentHandler.upgradeElements(button.parentNode)
}

function organizationSelected (e) {
  e.preventDefault()
  const selectedIndex = parseInt(e.target.dataset.myIndex, 10)
  const data = YFFData.organizations[selectedIndex]
  setupOrganization(data)
}

function createRadio (options) {
  const id = new Date().getMilliseconds()
  const label = document.createElement('label')
  const input = document.createElement('input')
  const span = document.createElement('span')
  label.classList.add('mdl-radio')
  label.classList.add('mdl-js-radio')
  label.classList.add('mdl-js-ripple-effect')
  label.classList.add('hoverGrey')
  input.classList.add('mdl-radio__button')
  span.classList.add('mdl-radio__label')
  input.setAttribute('id', id)
  input.setAttribute('data-my-index', options.index)
  input.setAttribute('name', options.name)
  input.setAttribute('type', 'radio')
  label.setAttribute('id', options.index)
  label.setAttribute('for', id)
  span.setAttribute('data-my-index', options.index)
  span.innerHTML = options.navn + ' - ' + options.forradrkommnavn
  label.appendChild(input)
  label.appendChild(span)
  return label
}

function buildOrganizationsSelector () {
  const div = document.getElementById('lookupWrapper')
  div.innerHTML = ''
  YFFData.organizations.forEach(function (item, index) {
    const radio = createRadio(Object.assign(item, {index: index, name: 'selectOrg'}))
    const br = document.createElement('br')
    div.appendChild(radio)
    div.appendChild(br)
    addListener(radio, 'click', organizationSelected)
  })
  showVelger('bedriftsVelger')
}

function lookupOrganization (e) {
  e.preventDefault()
  const queryField = document.getElementById('brregQuery')
  const messages = document.getElementById('lookupMessages')
  const query = queryField.value
  const url = `/yff/brreg`
  spinnerOn()
  messages.innerHTML = ''
  hideVelger('lookupMessages')
  hideVelger('bedriftsWrapper')
  hideVelger('bedriftsinfoWrapper')
  axios.post(url, {query: query})
    .then(function (result) {
      spinnerOff()
      YFFData.organizations = result.data
      if (result.data.length === 1) {
        setupOrganization(result.data[0])
      } else if (result.data.length === 0) {
        messages.innerHTML = 'Ingen bedrifter funnet. Vennligst forsøk med andre søkekriterier'
        showVelger('lookupMessages')
      } else {
        buildOrganizationsSelector()
      }
    }).catch(function (error) {
      console.error(error)
      spinnerOff()
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
