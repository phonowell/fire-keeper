it 'default', ->

  type = $.type $.relativePath
  unless type == 'function'
    throw 0