path = require 'path'

module.exports = (string) ->

  unless 'string' == $.type string
    return null

  # check isIgnore
  if string[0] == '!'
    isIgnore = true
    string = string[1...]

  # replace . & ~

  string = string.replace /\.{2}/g, '__parent_directory__'

  string = switch string[0]
    when '.' then string.replace /\./, $.root()
    when '~' then string.replace /~/, $.home()
    else string

  string = string.replace /__parent_directory__/g, '..'

  # replace ../ to ./../ at start
  if string[0] == '.' and string[1] == '.'
    string = "#{$.root()}/#{string}"

  # normalize
  string = path.normalize string
  .replace /\\/g, '/'

  # absolute
  unless path.isAbsolute string
    string = "#{$.root()}/#{string}"

  # ignore
  if isIgnore
    string = "!#{string}"

  # return
  _.trimEnd string, '/'