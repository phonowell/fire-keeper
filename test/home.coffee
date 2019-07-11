it 'default', ->

  type = $.type $.home
  unless type == 'function'
    throw 0