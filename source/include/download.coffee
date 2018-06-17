# https://github.com/kevva/download

###
download_(source, target, [option])
###

$.download_ = (arg...) ->

  [source, target, option] = switch arg.length
    when 2 then [arg[0], arg[1], null]
    when 3 then arg
    else throw makeError 'length'

  target = normalizePath target

  if $.type(option) == 'string'
    option = filename: option

  # this function download was from plugin
  await download source, target, option

  msg = "downloaded #{wrapList source} to #{wrapList target}"
  if option then msg += ", as '#{$.parseString option}'"
  $.info 'download', msg

  $ # return