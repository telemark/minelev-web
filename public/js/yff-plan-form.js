'use strict'

function init () {
  initPreview()
}

function validateDocumentForm () {
  const previewButton = document.getElementById('previewDocumentButton')
  previewButton.disabled = false
}

function addListener (element, type, func) {
  element.removeEventListener(type, func)
  element.addEventListener(type, func)
}

function ready (fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(init)
