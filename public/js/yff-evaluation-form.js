'use strict'

function init () {
  initPreview()
}

function validateDocumentForm () {
  console.log('were ok')
}

function ready (fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(init)
