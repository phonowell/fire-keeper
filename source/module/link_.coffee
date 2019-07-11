fse = require 'fs-extra'

export default (source, target) ->

  unless source and target
    throw 'link_/error: invalid argument length'

  source = $.normalizePath source
  target = $.normalizePath target

  await fse.ensureSymlink source, target

  $.info 'link'
  , "linked #{$.wrapList source} to #{$.wrapList target}"

  @ # return