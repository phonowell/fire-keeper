it '$.reload()', ->

  type = $.type $.reload
  unless type == 'function'
    throw 0