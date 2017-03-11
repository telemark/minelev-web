'use strict'

const pkg = require('../package.json')

module.exports = opts => {
  const baseOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url
  }
  const viewOptions = opts ? Object.assign(baseOptions, opts) : baseOptions
  return viewOptions
}
