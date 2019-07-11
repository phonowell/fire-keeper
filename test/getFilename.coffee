it 'default', ->

  type = $.type $.getFilename
  unless type == 'function'
    throw 0