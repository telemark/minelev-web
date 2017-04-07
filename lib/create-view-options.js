'use strict'

const pkg = require('../package.json')

module.exports = options => {
  const baseOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url
  }

  return options ? Object.assign(baseOptions, options) : baseOptions
}
