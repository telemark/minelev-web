'use strict'

let YFFData = {
  organizations: []
}

function init () {
  var lookupOrganizationButton = document.getElementById('lookupOrganisasjon')
  var bedriftsWrapper = document.getElementById('bedriftsinfoWrapper')
  var lookupField = document.getElementById('brregQuery')

  bedriftsWrapper.style.display = 'none'
  lookupOrganizationButton.addEventListener('click', function (e) {
    lookupOrganization()
  })

  setTimeout(function () {
    lookupField.focus()
  }, 500)
}

//MDL Text Input Cleanup
function mdlCleanUp () {
  var mdlInputs = document.querySelectorAll('.mdl-js-textfield');
  for (var i = 0, l = mdlInputs.length; i < l; i++) {
    mdlInputs[i].MaterialTextfield.checkDirty();
  }
}

function setupOrganization (data) {
  var bedriftsNavn = document.getElementById('organisasjonsNavn')
  var bedriftsAdresse = document.getElementById('organisasjonsAdresse')
  var bedriftsPostnummer = document.getElementById('organisasjonsPostnummer')
  var bedriftsPoststed = document.getElementById('organisasjonsPoststed')
  var bedriftsWrapper = document.getElementById('bedriftsinfoWrapper')
  // Updates fields
  bedriftsNavn.value = data.navn
  bedriftsAdresse.value = data.forretningsadresse.adresse
  bedriftsPostnummer.value = data.forretningsadresse.postnummer
  bedriftsPoststed.value = data.forretningsadresse.poststed
  // Reveal info
  mdlCleanUp()
  bedriftsWrapper.style.display = ''
}

function addListener (element, type, func) {
  element.removeEventListener(type, func)
  element.addEventListener(type, func)
}

function organizationSelected (e) {
  e.preventDefault()
  const selectedIndex = parseInt(e.target.value, 10)
  const data = YFFData.organizations[selectedIndex]
  setupOrganization(data)
}

function createRadio (options) {
  const id = new Date().getMilliseconds()
  const label = document.createElement('label')
  const input = document.createElement('input')
  const span = document.createElement('span')
  label.classList.add('mdl-textfield__label')
  input.classList.add('mdl-textfield__input')
  span.classList.add('mdl-textfield__label')
  input.setAttribute('id', id)
  input.setAttribute('name', options.name)
  label.setAttribute('type', 'radio')
  label.setAttribute('id', options.index)
  label.setAttribute('for', id)
  label.innerHTML = options.text
  label.appendChild(input)
  label.appendChild(span)
  return label
}

function buildOrganizationsSelector () {
  const div = document.getElementById('lookupWrapper')
  div.innerHTML = ''
  YFFData.organizations.forEach((item, index) => {
    const radio = createRadio(Object.assign(item, {index: index}))
    div.appendChild(radio)
    addListener(radio, 'click', organizationSelected)
  })
}

function lookupOrganization () {
  const queryField = document.getElementById('brregQuery')
  const query = queryField.value
  const lookupIcon = document.getElementById('searchIcon')
  const url = `/yff/brreg`
  lookupIcon.innerText = 'hourglass_empty'
  axios.post(url, {query: query})
    .then(result => {
      lookupIcon.innerText = 'search'
      YFFData.organizations = result.data
      buildOrganizationsSelector()
    }).catch(error => {
      console.error(error)
      lookupIcon.innerText = 'search'
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
