fse = require 'fs-extra'

module.exports = (source) ->

  groupSource = $.normalizePathToArray source
  unless groupSource.length
    return false

  for source in groupSource
    isExisted = await fse.pathExists source
    unless isExisted
      return false

  true # return