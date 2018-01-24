# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.delay([time])', ->

  it '$$.delay()', ->

    if $$.delay != $.delay
      throw new Error()

    unless _.isFunction $$.delay
      throw new Error()