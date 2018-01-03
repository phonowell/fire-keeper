# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.update()', ->

  it '$$.update()', ->

    if !$$.update
      throw new Error()