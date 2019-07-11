fse = require 'fs-extra'

export default (source) ->

  listSource = await $.source_ source
  unless listSource.length
    return @
  
  msg = "removed #{$.wrapList source}"

  for source in listSource
    await fse.remove source

  $.info 'remove', msg

  @ # return