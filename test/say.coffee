# require

$$ = require './../index'
{$, _} = $$.library

# variable

temp = './temp'

# function

clean = -> await $$.remove temp

# test

describe '$$.say(text)', ->

  it '$$.say()', ->
    await clean()

    if !$$.say
      throw new Error()

    unless _.isFunction $$.say
      throw new Error()

    await clean()