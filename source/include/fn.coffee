###

  _cloneGitHub(name)
  _error(msg)
  _formatSource(source)

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

_formatSource = (source) ->
  source = switch $.type source
    when 'array' then source
    when 'string' then [source]
    else throw _error 'type'
  (path.normalize src for src in source)