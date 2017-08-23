# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.task(source)', ->

  it '$$.task()', ->

    if !$$.task
      throw new Error()
