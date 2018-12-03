###
excludeInclude(source)
formatArgument(arg)
formatPath(source)
getRelativePath(source, target)
normalizePath(source)
wrapList(list)
###

excludeInclude = (source) ->

  source = formatArgument source
  source.push '!**/include/**'
  source = _.uniq source

  source # return

formatArgument = (arg) ->
  switch $.type arg
    when 'array' then _.clone arg
    when 'string' then [arg]
    else throw new Error 'invalid type'

formatPath = (source) ->
  source = formatArgument source
  (normalizePath src for src in source)

normalizePath = (source) ->

  if $.type(source) != 'string'
    return null

  # check isIgnore
  if source[0] == '!'
    isIgnore = true
    source = source[1...]

  # replace \ to /
  source = source.replace /\\/g, '/'

  # replace . & ~

  source = source.replace /\.{2}/g, '__parent_directory__'

  source = switch source[0]
    when '.' then source.replace /\./, $.path.base
    when '~' then source.replace /~/, $.path.home
    else source

  source = source.replace /__parent_directory__/g, '..'

  # replace ../ to ./../ at start
  if source[0] == '.' and source[1] == '.'
    source = "#{$.path.base}/#{source}"

  # normalize
  source = path.normalize source

  # absolute
  unless path.isAbsolute source
    source = "#{$.path.base}#{path.sep}#{source}"

  # ignore
  if isIgnore
    source = "!#{source}"

  source # return

wrapList = (list) ->

  if !list then return ''

  list = switch $.type list
    when 'array' then _.clone list
    when 'string' then [list]
    else throw new Error 'invalid type'

  ("'#{key}'" for key in list).join ', '

# return
$.fn = {
  excludeInclude
  formatArgument
  formatPath
  normalizePath
  wrapList
}

###
$.fn.require(source)
###

$.fn.require = (source) -> require normalizePath source