fse = require 'fs-extra'

export default (source) ->

  unless source
    throw 'mkdir_/error: invalid source'

  source = $.normalizePathToArray source

  listPromise = (fse.ensureDir src for src in source)

  await Promise.all listPromise

  $.info 'create', "created #{$.wrapList source}"

  @ # return