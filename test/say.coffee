# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.say(text)', ->

  it '$$.say()', ->

    if !$$.say
      throw new Error()