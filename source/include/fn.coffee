###

  _cloneGitHub(name)
  _error(msg)
  _formatPath(source)
  _normalizePath(source)

###

_cloneGitHub = co (name) ->

  if fs.existsSync "#{$$.base}/../#{name}" then return

  yield $$.shell "git clone
  https://github.com/phonowell/#{name}.git
  #{$$.base}/../#{name}"

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

_normalizePath = (source) -> path.normalize source.replace /\\/g, '/'