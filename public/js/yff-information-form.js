'use strict'

let YFFData = {
  organizations: []
}

function init () {
  const lookupOrganizationButton = document.getElementById('lookupOrganisasjonsButton')
  const bedriftsWrapper = document.getElementById('bedriftsinfoWrapper')
  const lookupField = document.getElementById('brregQuery')
  const lookupForm = document.getElementById('lookupOrganisasjonForm')
  bedriftsWrapper.style.display = 'none'
  hideVelger('bedriftsVelger')
  hideVelger('lookupMessages')
  lookupForm.addEventListener('submit', e => {
    e.preventDefault()
    lookupOrganization()
  })
  lookupOrganizationButton.addEventListener('click', e => {
    e.preventDefault()
    lookupOrganization()
  })

  setTimeout(function () {
    lookupField.focus()
  }, 500)
}

function hideVelger (velger) {
  const velgers = document.querySelectorAll(`.${velger}`)
  velgers.forEach(item => item.style.display = 'none')
}

function showVelger (velger) {
  const velgers = document.querySelectorAll(`.${velger}`)
  velgers.forEach(item => item.style.display = '')
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
}

function addListener (element, type, func) {
  element.removeEventListener(type, func)
  element.addEventListener(type, func)
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
  span.innerHTML = `${options.navn} - ${options.forradrkommnavn}`
  label.appendChild(input)
  label.appendChild(span)
  return label
}

function buildOrganizationsSelector () {
  const div = document.getElementById('lookupWrapper')
  div.innerHTML = ''
  YFFData.organizations.forEach((item, index) => {
    const radio = createRadio(Object.assign(item, {index: index, name: 'selectOrg'}))
    const br = document.createElement('br')
    div.appendChild(radio)
    div.appendChild(br)
    addListener(radio, 'click', organizationSelected)
  })
  showVelger('bedriftsVelger')
}

function lookupOrganization () {
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
    .then(result => {
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
    }).catch(error => {
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
