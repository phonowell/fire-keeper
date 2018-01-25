# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.delay([time], [callback])', ->

  it '$$.delay()', ->

    unless _.isFunction $$.delay
      throw new Error()