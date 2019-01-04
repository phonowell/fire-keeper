###
clean_(source)
###

$.clean_ = (source) ->

  type = $.type source
  unless type == 'string'
    throw new Error "invalid type '#{type}'"

  await $.remove_ source

  pathDir = $.getDirname source
  
  listSource = await $.source_ "#{pathDir}/**/*"
  if listSource.length
    return $
  
  await $.remove_ pathDir

  $ # return