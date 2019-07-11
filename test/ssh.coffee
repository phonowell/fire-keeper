it 'default', ->

  type = $.type $.ssh
  unless type == 'function'
    throw 0