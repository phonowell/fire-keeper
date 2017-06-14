###

  _formatSource(source)

###

_formatSource = (source) ->
  source = switch $.type source
    when 'array' then source
    when 'string' then [source]
    else throw _error 'type'
  (path.normalize src for src in source)