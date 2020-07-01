'use strict'

function init () {
  var radios = document.querySelectorAll('.document-type-selector')
  var periods = document.querySelectorAll('.period-selector')
  var samtaler = document.querySelectorAll('.samtaleSelector')
  var checkboxes = document.querySelectorAll('.mdl-checkbox')

  hideAllCheckboxes()
  hideAllHeaders()
  validateDocumentForm()
  hideMe('warningPeriod')
  Array.prototype.forEach.call(radios, function(el) {
    el.addEventListener('click', function (e) {
      hideAllCheckboxes()
      hideAllHeaders()
      showMe(e.target.value)
      showWarningPeriods()
      validateDocumentForm()
    })
    if (el.checked) {
      showMe(el.value)
    }
  })
  Array.prototype.forEach.call(checkboxes, function(el) {
    el.addEventListener('click', function (e) {
      validateDocumentForm()
    })
  })
  Array.prototype.forEach.call(periods, function(el) {
    el.addEventListener('click', function (e) {
      validateDocumentForm()
    })

  })
  Array.prototype.forEach.call(samtaler, function(el) {
    el.addEventListener('click', function (e) {
      validateDocumentForm()
    })

  })

  preselectFag()

  initPreview()
}

function preselectFag () {
  var radios = document.querySelectorAll('.document-type-selector')
  var courses = document.querySelectorAll('.chxBxfagInput')
  if (radios.length === 1) {
    radios[0].checked = true
    showMe(radios[0].value)
    showWarningPeriods()
  }
  if (courses.length === 1) {
    courses[0].checked = true
  }
}

function showMe (type) {
  var thisClass = '.chxBx' + type
  var checkBoxes = document.querySelectorAll(thisClass)
  Array.prototype.forEach.call(checkBoxes, function(el) {
    el.style.display = ''
  })
}

function hideMe (type) {
  var thisClass = '.chxBx' + type
  var checkBoxes = document.querySelectorAll(thisClass)
  Array.prototype.forEach.call(checkBoxes, function(el) {
    el.style.display = 'none'
  })
}

function showWarningPeriods () {
  var radios = document.querySelectorAll('.document-type-selector')
  var type = false
  Array.prototype.forEach.call(radios, function(el) {
    if (el.checked) {
      type = el.value
    }
  })
  if (type !== 'samtale') {
    showMe('warningPeriod')
  } else {
    hideMe('warningPeriod')
  }
}

function hideAllCheckboxes () {
  var checkBoxes = document.querySelectorAll('.mdl-checkbox')
  Array.prototype.forEach.call(checkBoxes, function(el) {
    el.style.display = 'none'
  })
}

function hideAllHeaders () {
  var headers = document.querySelectorAll('.document-form-header')
  Array.prototype.forEach.call(headers, function(el) {
    el.style.display = 'none'
  })
}

function validateDocumentForm () {
  var submitButton = document.getElementById('submitWarning')
  var previewButton = document.getElementById('previewDocumentButton')
  var documentTypes = document.querySelectorAll('.document-type-selector')
  var periods = document.querySelectorAll('.period-selector')
  var checkBoxes = document.querySelectorAll('.mdl-checkbox__input')
  var arsakCourse = document.querySelectorAll('.course-category-selector')
  var samtaler = document.querySelectorAll('.samtaleSelector')
  var checkboxCount = 0
  var type = false
  var typeOK = false
  var periodOK = false
  var courseOK = false
  var reasonOK = false
  var samtaleOK = false

  // Starts by disabling button
  submitButton.disabled = true
  previewButton.disabled = true

  Array.prototype.forEach.call(documentTypes, function(el) {
    if (el.checked) {
      type = el.value
      typeOK = true
    }
  })

  Array.prototype.forEach.call(periods, function(el) {
    if (el.checked) {
      periodOK = true
    }
  })

  Array.prototype.forEach.call(arsakCourse, function(el) {
    if (el.checked) {
      reasonOK = true
    }
  })

  Array.prototype.forEach.call(checkBoxes, function(el) {
    if (el.checked) {
      if (type === 'atferd' && /behaviour/.test(el.id)) {
        checkboxCount ++
      }
      if (type === 'orden' && /order/.test(el.id)) {
        checkboxCount ++
      }
      if (type === 'fag' && /course/.test(el.id)) {
        checkboxCount ++
      }
    }
  })

  if (type === 'fag' && checkboxCount > 0) {
    courseOK = true
  }

  if (type !== 'fag' && checkboxCount > 0) {
    reasonOK = true
    courseOK = true
  }

  if (type === 'samtale') {
    reasonOK = true
    courseOK = true
    periodOK = true
    Array.prototype.forEach.call(samtaler, function(el) {
      if (el.checked) {
        samtaleOK = true
      }
    })
  } else {
    samtaleOK = true
  }

  // If everything is OK let's go :-)
  if (typeOK && periodOK && courseOK && reasonOK && samtaleOK) {
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
