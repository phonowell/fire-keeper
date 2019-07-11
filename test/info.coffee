it 'default', ->

  type = $.type $.info().renderPath
  unless type == 'function'
    throw 0

  type = $.type $.info().silence_
  unless type == 'asyncfunction'
    throw type

  result = $.info 'test'
  unless result == 'test'
    throw 2