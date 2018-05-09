const config = require('./index')

module.exports = {
  useYFF: config.FEATURE_USE_YFF || false,
  useNotes: config.FEATURE_USE_NOTES || false,
  usePictures: config.FEATURE_USE_PICTURES || false
}
