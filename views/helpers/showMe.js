'use strict'

module.exports = input => {
  return input !== false || input.length > 0 ? 'show-me' : 'hide-me'
}
