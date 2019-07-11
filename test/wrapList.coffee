it 'default', ->

  result = $.wrapList ['a', 'b', 'c']
  answer = "'a', 'b', 'c'"
  
  unless result == answer
    throw 0