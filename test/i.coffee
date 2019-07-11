it 'default', ->

  type = $.type $.i
  unless type == 'function'
    throw 0

  result = $.i 'test'
  unless result == 'test'
    throw 1