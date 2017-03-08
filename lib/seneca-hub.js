'use strict'

module.exports = function senecaHub (options) {
  const seneca = this

  seneca.add('role:info, info:preview', (args, callback) => {
    console.log(`Preview generated: ${args.data.navnElev}`)
    callback(null, {success: true, msg: 'Stats submitted'})
  })

  return options.tag || 'seneca-hub'
}
