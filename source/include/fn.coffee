###
excludeInclude(source)
formatArgument(arg)
getPlugin(name)
normalizePath(string)
normalizePathToArray(source)
wrapList(list)
###

excludeInclude = (source) ->
  source = formatArgument source
  source.push '!**/include/**'
  source = _.uniq source # return

formatArgument = (arg) ->
  switch type = $.type arg
    when 'array' then _.clone arg
    when 'string' then [arg]
    else throw new Error "invalid type '#{type}'"

getPlugin = (name) ->
  if name == 'uglify'
    return $.plugin.uglify or= do ->
      uglifyEs = require 'uglify-es'
      composer = require 'gulp-uglify/composer'
      composer uglifyEs, console
  throw new Error "invalid plugin '#{name}'"

normalizePath = (string) ->

  unless 'string' == $.type string
    return null

  # check isIgnore
  if string[0] == '!'
    isIgnore = true
    string = string[1...]

  # replace . & ~

  string = string.replace /\.{2}/g, '__parent_directory__'

  string = switch string[0]
    when '.' then string.replace /\./, $.path.base
    when '~' then string.replace /~/, $.path.home
    else string

  string = string.replace /__parent_directory__/g, '..'

  # replace ../ to ./../ at start
  if string[0] == '.' and string[1] == '.'
    string = "#{$.path.base}/#{string}"

  # normalize
  string = path.normalize string
  .replace /\\/g, '/'

  # absolute
  unless path.isAbsolute string
    string = "#{$.path.base}/#{string}"

  # ignore
  if isIgnore
    string = "!#{string}"

  # return
  _.trimEnd string, '/'

normalizePathToArray = (source) ->
  groupSource = formatArgument source
  (normalizePath source for source in groupSource)

wrapList = (list) ->

  unless list
    return ''

  list = switch $.type list
    when 'array' then _.clone list
    when 'string' then [list]
    else throw new Error 'invalid type'

  ("'#{key}'" for key in list).join ', '

# return
$.fn = {
  excludeInclude
  formatArgument
  getPlugin
  normalizePath
  normalizePathToArray
  wrapList
}

###
fn.require(source)
###

$.fn.require = (source) -> require normalizePath source
