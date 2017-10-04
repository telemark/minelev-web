'use strict'

function init () {
  var lookupOrganizationButton = document.getElementById('lookupOrganisasjonsnummer')
  var bedriftsWrapper = document.getElementById('bedriftsinfoWrapper')
  var lookupField = document.getElementById('organisasjonsNummer')

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

function lookupOrganization () {
  var organizationNumberField = document.getElementById('organisasjonsNummer')
  var organizationNumber = organizationNumberField.value
  var lookupIcon = document.getElementById('searchIcon')
  const url = `https://organisasjonsnummer.service.t-fk.no?organisasjonsnummer=${organizationNumber}`
  lookupIcon.innerText = 'hourglass_empty'
  axios.get(url)
    .then(result => {
      lookupIcon.innerText = 'search'
      setupOrganization(result.data)
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
