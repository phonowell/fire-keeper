###

  excludeInclude(source)
  formatArgument(arg)
  formatPath(source)
  getRelativePath(source, target)
  makeError(msg)
  normalizePath(source)
  wrapList(list)

###

excludeInclude = (source) ->

  source = formatArgument source
  source.push '!**/include/**'
  source = _.uniq source

  # return
  source

formatArgument = (arg) ->
  switch $.type arg
    when 'array' then _.clone arg
    when 'string' then [arg]
    else throw makeError 'type'

formatPath = (source) ->
  source = formatArgument source
  (normalizePath src for src in source)

makeError = (msg) ->
  new Error switch msg
    when 'extname' then 'invalid extname'
    when 'filename' then 'invalid filename'
    when 'length' then 'invalid argument length'
    when 'source' then 'invalid source'
    when 'target' then 'invalid target'
    when 'type' then 'invalid argument type'
    else msg

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
    when '.' then source.replace /\./, $$.path.base
    when '~' then source.replace /~/, $$.path.home
    else source

  source = source.replace /__parent_directory__/g, '..'

  # replace ../ to ./../ at start

  if source[0] == '.' and source[1] == '.'
    source = "#{$$.path.base}/#{source}"

  # normalize

  source = path.normalize source

  # absolute

  unless path.isAbsolute source
    source = "#{$$.path.base}#{path.sep}#{source}"

  # ignore
  if isIgnore
    source = "!#{source}"

  # return
  source

wrapList = (list) ->

  if !list then return ''

  list = switch $.type list
    when 'array' then _.clone list
    when 'string' then [list]
    else throw makeError 'type'

  ("'#{key}'" for key in list).join ', '

# return
$$.fn = {
  excludeInclude
  formatArgument
  formatPath
  makeError
  normalizePath
  wrapList
}