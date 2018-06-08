'use strict'

function init () {
  var noteContentField = document.getElementById('noteContent')

  validateDocumentForm()

  noteContentField.addEventListener('keyup', function (e) {
    validateDocumentForm()
  })

  initPreview()

  setTimeout(function () {
    noteContentField.focus()
  }, 500)
}

function validateDocumentForm () {
  var submitButton = document.getElementById('submitNote')
  var previewButton = document.getElementById('previewDocumentButton')
  var noteContentField = document.getElementById('noteContent')
  // Starts by disabling button
  submitButton.disabled = true
  previewButton.disabled = true

  // If everything is OK let's go :-)
  if (noteContentField.value.length > 0) {
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
