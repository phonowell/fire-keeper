it 'default', ->

  type = $.type $.getExtname
  unless type == 'function'
    throw 0