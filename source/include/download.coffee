# https://github.com/kevva/download

###

  download(source, target, [option])

###

$$.download = co (arg...) ->

  [source, target, option] = switch arg.length
    when 2 then [arg[0], arg[1], null]
    when 3 then arg
    else throw _error 'length'

  target = _normalizePath target

  if $.type option == 'string'
    option = filename: option

  yield download source, target, option

  msg = "downloaded '#{source}' to '#{target}'"
  if option then msg += ", as '#{$.parseString option}'"
  $.info 'download', msg