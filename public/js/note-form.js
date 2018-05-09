'use strict'

function init () {
  var radios = document.querySelectorAll('.note-type-selector')

  validateDocumentForm()
  Array.prototype.forEach.call(radios, function(el) {
    el.addEventListener('click', function (e) {
      validateDocumentForm()
    })
  })
  
  initPreview()
}

function validateDocumentForm () {
  var submitButton = document.getElementById('submitNote')
  var previewButton = document.getElementById('previewDocumentButton')
  var noteTypes = document.querySelectorAll('.note-type-selector')
  var type = false
  var typeOK = false
  
  // Starts by disabling button
  submitButton.disabled = true
  previewButton.disabled = true

  Array.prototype.forEach.call(notesTypes, function(el) {
    if (el.checked) {
      type = el.value
      typeOK = true
    }
  })

  // If everything is OK let's go :-)
  if (typeOK) {
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
