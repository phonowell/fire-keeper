it 'default', ->

  type = $.type $.root
  unless type == 'function'
    throw 0