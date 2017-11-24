module.exports = (id = '') => `VG${id.match(/\d/) ? id.match(/\d/)[0] : 1}`
