fse = require 'fs-extra'

module.exports = (source) ->

  listSource = await $.source_ source
  unless listSource.length
    return @
  
  msg = "removed #{$.wrapList source}"

  for source in listSource
    await fse.remove source

  $.info 'remove', msg

  @ # return