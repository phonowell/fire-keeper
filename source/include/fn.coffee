###

  _cloneGitHub(name)
  _formatSource(source)

###

_cloneGitHub = co (name) ->

  if fs.existsSync "#{$$.base}/../#{name}" then return

  yield $$.shell "git clone
  https://github.com/phonowell/#{name}.git
  #{$$.base}/../#{name}"

_formatSource = (source) ->
  source = switch $.type source
    when 'array' then source
    when 'string' then [source]
    else throw _error 'type'
  (path.normalize src for src in source)