do ->

  namespace = '__data__'

  fn = $$.config = (args...) ->

    switch args.length
      when 0 then fn[namespace]
      when 1
        switch $.type arg = args[0]
          when 'string' then fn.get arg
          when 'object' then fn.setMap arg
          else throw new Error 'invalid arguments type'
      when 2 then fn.set args...
      else throw new Error 'invalid arguments length'

  fn[namespace] = {}

  fn.get = (key) -> fn[namespace][key]

  fn.set = (key, value) -> fn[namespace][key] = value

  fn.setMap = (map) ->
    for key, value of map
      fn[namespace][key] = value