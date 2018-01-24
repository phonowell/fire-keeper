# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.say(text)', ->

  it '$$.say()', ->

    if !$$.say
      throw new Error()

    unless _.isFunction $$.say
      throw new Error()