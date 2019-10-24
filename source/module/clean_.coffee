module.exports = (source) ->

  type = $.type source
  unless type == 'string'
    throw "clean_/error: invalid type '#{type}'"

  await $.remove_ source

  dirname = $.getDirname source
  
  listSource = await $.source_ "#{dirname}/**/*"
  if listSource.length
    return @
  
  await $.remove_ dirname

  @ # return