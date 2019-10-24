# https://github.com/kevva/download

module.exports = (arg...) ->

  [source, target, option] = switch arg.length
    when 2 then [arg[0], arg[1], null]
    when 3 then arg
    else throw 'download_/error: invalid argument length'

  target = $.normalizePath target

  if ($.type option) == 'string'
    option =
      filename: option

  # this function download was from plugin
  download = require 'download'
  await download source, target, option

  msg = "downloaded #{$.wrapList source} to #{$.wrapList target}"
  if option
    msg += ", as '#{$.parseString option}'"
  $.info 'download', msg

  @ # return