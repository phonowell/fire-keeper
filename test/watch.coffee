# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.watch()', ->

  it '$$.watch()', ->

    if $$.watch != $$.plugin.watch
      throw new Error()