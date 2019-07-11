it 'default', ->

  type = $.type $.chain
  unless type == 'function'
    throw 0