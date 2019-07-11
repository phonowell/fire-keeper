it 'default', ->

  type = $.type $.require
  unless type == 'function'
    throw 0