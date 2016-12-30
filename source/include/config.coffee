do ->

  namespace = '__data__'

  fn = $$.config = (args...) ->

    switch args.length
      when 1 then fn.get args...
      when 2 then fn.set args...
      else throw 'invalid arguments length'

  fn[namespace] = {}

  fn.get = (key) -> fn[namespace][key]

  fn.set = (key, value) -> fn[namespace][key] = value