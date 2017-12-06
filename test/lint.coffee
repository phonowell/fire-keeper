# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.lint(source)', ->

  it '$$.lint()', ->

    if !$$.lint
      throw new Error()