it 'default', ->

  type = $.type $.getBasename
  unless type == 'function'
    throw 0