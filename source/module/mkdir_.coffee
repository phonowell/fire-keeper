fse = require 'fs-extra'

# return
$.mkdir_ = (source) ->

  unless source
    throw new Error 'invalid source'

  source = normalizePathToArray source

  listPromise = (fse.ensureDir src for src in source)

  await Promise.all listPromise

  $.info 'create', "created #{wrapList source}"

  $ # return
