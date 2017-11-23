'use strict'

function initPreview () {
  var previewButton = document.getElementById('previewDocumentButton')
  var closePreviewButtons = document.querySelectorAll('.closePreviewButton')
  var modalPreview = document.getElementById('modalPreview')
  var documentCard = document.getElementById('documentCard')

  previewButton.addEventListener('click', function (e) {
    previewDocument(e)
  })


  Array.prototype.forEach.call(closePreviewButtons, function(el) {
    el.addEventListener('click', function (e) {
      modalPreview.style.visibility = 'hidden'
      documentCard.style.display = 'none'
      modalPreview.style.opacity = 0
      documentCard.style.visibility = 'visible'
      documentCard.style.display = ''
      documentCard.style.opacity = 1
      location.hash='pageTop'
      location.hash=''
    })
  })
}

var BASE64_MARKER = ';base64,';

function convertDataURIToBinary(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

function previewDocument (e) {
  e.preventDefault()
  var previewButton = document.getElementById('previewDocumentButton')
  var modalPreview = document.getElementById('modalPreview')
  var documentCard = document.getElementById('documentCard')
  var form = document.getElementById('submitDocumentForm')
  var previewContainer = document.getElementById('previewContainer')
  var xhr = new XMLHttpRequest()
  var snackbarContainer = document.querySelector('.mdl-js-snackbar')
  var data = {
    message: 'Forhåndsvisning genereres nå. Vennligst vent...',
    timeout: 2000
  }

  snackbarContainer.MaterialSnackbar.showSnackbar(data)
  previewButton.disabled = true
  previewButton.textContent = 'cloud_download'

  xhr.open('POST', previewButton.getAttribute('formaction'), true)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.onload = function() {
    if (xhr.status === 200) {
      var pdfAsDataUri = "data:application/pdf;base64," + xhr.responseText
      var pdfAsArray = convertDataURIToBinary(pdfAsDataUri)
      previewContainer.innerHTML = ''
      renderPDF(pdfAsArray, previewContainer)
      modalPreview.style.visibility = 'visible'
      modalPreview.style.display = ''
      modalPreview.style.opacity = 1
      documentCard.style.visibility = 'hidden'
      documentCard.style.display = 'none'
      documentCard.style.opacity = 0
    }
    else if (xhr.status !== 200) {
      console.error(xhr.status)
    }
    previewButton.textContent = 'description'
    validateDocumentForm()
  }
  xhr.send(serialize(form))
}

function renderPDF(data, canvasContainer, options) {
  // Watermark inspired by http://jsfiddle.net/EAXc9/7/

  var options = options || { scale: 1.5 };

  function renderPage(page) {
    var viewport = page.getViewport(options.scale);
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    var wmCanvas=document.createElement("canvas");
    wmCanvas.id="watermark";
    wmCanvas.height=viewport.height;
    wmCanvas.width=viewport.width;

    canvasContainer.appendChild(wmCanvas);
    canvasContainer.appendChild(canvas);

    var wmContext=wmCanvas.getContext('2d');
    wmContext.globalAlpha=0.2;
    // setup text for filling
    wmContext.font = "72px Arial" ;
    wmContext.fillStyle = "#e30438";
    // get the metrics with font settings
    var metrics = wmContext.measureText("F o r h å n d s v i s n i n g");
    var width = metrics.width;
    // height is font size
    var height = 72;
    // change the origin coordinate to the middle of the context
    wmContext.translate(viewport.width/2, viewport.height/2);
    // rotate the context (so it's rotated around its center)
    wmContext.rotate(-Math.atan(viewport.height/viewport.width));
    // as the origin is now at the center, just need to center the text
    wmContext.fillText("F o r h å n d s v i s n i n g",-width/2,height/2);

    page.render(renderContext);

  }

  function renderPages(pdfDoc) {
    for(var num = 1; num <= pdfDoc.numPages; num++)
      pdfDoc.getPage(num).then(renderPage);
  }

  PDFJS.disableWorker = true;
  PDFJS.getDocument(data).then(renderPages);
}
