it 'default', ->

  type = $.type $.say_
  unless type == 'asyncfunction'
    throw 0

  result = await $.say_ 'a test message'
  unless result == $
    throw 1