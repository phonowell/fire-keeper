it 'default', ->

  type = $.type $.argv
  unless type == 'function'
    throw 0