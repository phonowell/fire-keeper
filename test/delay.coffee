# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.delay([time])', ->

  it '$$.delay()', ->

    if $$.delay != $.delay
      throw new Error()
