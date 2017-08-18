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

  src = source.replace /\\/g, '/'

  src = switch src[0]
    when '.' then src.replace /\./, $$.path.base
    when '~' then src.replace /~/, $$.path.home
    else src

  src = path.normalize src

  if path.isAbsolute src then return src
  else return "#{$$.path.base}#{path.sep}#{src}"