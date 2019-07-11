it '$.watch()', ->

  type = $.type $.watch
  unless type == 'function'
    throw 0