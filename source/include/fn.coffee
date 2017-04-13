_normalizePath = (src) ->

  src = switch $.type src
    when 'string' then [src]
    when 'array' then src
    else throw new Error ERROR.type

  (path.normalize _src for _src in src)