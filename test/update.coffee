# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.update()', ->

  it '$$.update()', ->

    if !$$.update
      throw new Error()
