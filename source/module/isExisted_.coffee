fse = require 'fs-extra'

# return
$.isExisted_ = (source) ->

  groupSource = normalizePathToArray source
  unless groupSource.length
    return false

  for source in groupSource
    isExisted = await fse.pathExists source
    unless isExisted
      return false

  true # return
