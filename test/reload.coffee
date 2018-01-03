# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.reload(source)', ->

  it '$$.reload()', ->

    if !$$.reload
      throw new Error()