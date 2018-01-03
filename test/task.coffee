# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.task(source)', ->

  it '$$.task()', ->

    if !$$.task
      throw new Error()