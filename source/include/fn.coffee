###

  _cloneGitHub(name)
  _error(msg)
  _formatPath(source)
  _normalizePath(source)

###

_cloneGitHub = co (name) ->

  source = _normalizePath "./../#{name}"
  if yield $$.isExisted source then return

  yield $$.shell "git clone
  https://github.com/phonowell/#{name}.git
  #{$$.path.base}/../#{name}"

_error = (msg) ->
  new Error switch msg
    when 'extname' then 'invalid extname'
    when 'length' then 'invalid argument length'
    when 'source' then 'invalid source'
    when 'target' then 'invalid target'
    when 'type' then 'invalid argument type'
    else msg

_formatPath = (source) ->
  source = switch $.type source
    when 'array' then source
    when 'string' then [source]
    else throw _error 'type'
  (_normalizePath src for src in source)

_normalizePath = (source) ->

  if $.type(source) != 'string'
    return null

  # check isIgnore

  if source[0] == '!'
    isIgnore = true
    source = source[1...]

  # replace \ to /

  source = source.replace /\\/g, '/'

  # replace . & ~

  source = switch source[0]
    when '.' then source.replace /\./, $$.path.base
    when '~' then source.replace /~/, $$.path.home
    else source

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
