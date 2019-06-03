fse = require 'fs-extra'

# return
$.link_ = (source, target) ->

  unless source and target
    throw new Error 'invalid argument length'

  source = normalizePath source
  target = normalizePath target

  await fse.ensureSymlink source, target

  $.info 'link', "linked #{wrapList source} to #{wrapList target}"

  $ # return
