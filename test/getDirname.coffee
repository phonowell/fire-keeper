it 'default', ->

  type = $.type $.getDirname
  unless type == 'function'
    throw 0