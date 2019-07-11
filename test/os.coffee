it 'default', ->

  type = $.type $.os
  unless type == 'function'
    throw 0