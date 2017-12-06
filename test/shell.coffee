# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.shell()', ->

  it '$$.shell()', ->

    if $$.shell != $.shell
      throw new Error()