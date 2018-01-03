# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.lint(source)', ->

  it '$$.lint()', ->

    if !$$.lint
      throw new Error()