it 'default', ->

  result = $.formatArgument 'test-a'
  answer = ['test-a']

  unless _.isEqual result, answer
    throw 0

  result = $.formatArgument ['test-b']
  answer = ['test-b']

  unless _.isEqual result, answer
    throw 1