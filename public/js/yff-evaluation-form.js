'use strict'

function init () {
  initPreview()
}

function validateDocumentForm () {
  const previewButton = document.getElementById('previewDocumentButton')
  const submitButton = document.getElementById('submitFormButton')
  const requiredFields = document.getElementById('submitDocumentForm').querySelectorAll('[required]')
  let requiredValues = []

  // Disables buttons
  previewButton.disabled = false
  submitButton.disabled = false

  requiredFields.forEach(field => {
    if (field.checked) {
      requiredValues.push(true)
    }
  })

  if (requiredValues.length === requiredFields.length) {
    submitButton.disabled = false
    previewButton.disabled = false
  }
}

function ready (fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(init)
