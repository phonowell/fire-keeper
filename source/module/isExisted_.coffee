fse = require 'fs-extra'

export default (source) ->

  groupSource = $.normalizePathToArray source
  unless groupSource.length
    return false

  for source in groupSource
    isExisted = await fse.pathExists source
    unless isExisted
      return false

  true # return