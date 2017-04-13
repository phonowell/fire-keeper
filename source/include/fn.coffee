_normalizePath = (src) ->

  src = switch $.type src
    when 'string' then [src]
    when 'array' then src
    else throw _error 'type'

  (path.normalize _src for _src in src)