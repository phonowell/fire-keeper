# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.watch()', ->

  it '$$.watch()', ->

    if $$.watch != $$.plugin.watch
      throw new Error()
