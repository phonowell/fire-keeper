# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.reload(source)', ->

  it '$$.reload()', ->

    if !$$.reload
      throw new Error()