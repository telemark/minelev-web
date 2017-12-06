'use strict'

function init () {
  const requiredFields = document.getElementById('submitDocumentForm').querySelectorAll('[required]')
  requiredFields.forEach(function (field) {
    addListener(field, 'click', validateDocumentForm)
  })
  initPreview()
  validateDocumentForm()
}

function addListener (element, type, func) {
  element.removeEventListener(type, func)
  element.addEventListener(type, func)
}

function validateDocumentForm () {
  const previewButton = document.getElementById('previewDocumentButton')
  const submitButton = document.getElementById('submitFormButton')
  const requiredFields = document.getElementById('submitDocumentForm').querySelectorAll('[required]')
  let requiredNames = new Set()
  let requiredValues = []

  requiredFields.forEach(function (field) {
    requiredNames.add(field.name)
  })

  // Disables buttons
  previewButton.disabled = true
  submitButton.disabled = true

  requiredFields.forEach(function (field) {
    if (field.checked) {
      requiredValues.push(true)
    }
  })

  if (requiredValues.length === requiredNames.size) {
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
