'use strict'

function addListenerToImageButtons () {
  const buttons = document.querySelectorAll('.showPictureButton')
  buttons.forEach(button => {
    button.addEventListener('click', showProfileImage)
    button.addEventListener('mouseover', showProfileImage)
  })
}

async function showProfileImage (e) {
  e.preventDefault()
  const imageId = e.target.dataset.imageId
  const imagePlaceHolder = document.getElementById(`profile-image-${imageId}`)
  if (imagePlaceHolder) {
    imagePlaceHolder.style.display =''
  } else {
    e.target.innerHTML = 'hourglass_empty'
    const imageUrl = `https://photos.minelev.no/user/${imageId}/base64`
    const { data } = await axios.get(imageUrl)
    const imgSrc = `data:image/png;base64, ${data}`
    const img = document.createElement('img')
    img.setAttribute('src', imgSrc)
    img.setAttribute('id', `profile-image-${imageId}`)
    img.setAttribute('data-image-id', imageId)
    img.classList.add('list-profile-image')
    img.addEventListener('mouseout', hideProfileImage)
    img.addEventListener('click', hideProfileImage)
    e.target.parentNode.insertBefore(img, e.target)
    e.target.innerHTML = 'assignment_ind'
  }
}

function hideProfileImage (e) {
  e.preventDefault()
  const imageId = e.target.dataset.imageId
  const imagePlaceHolder = document.getElementById(`profile-image-${imageId}`)
  imagePlaceHolder.style.display = 'none'
}

function readyForImageButtons (fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

readyForImageButtons(addListenerToImageButtons)
