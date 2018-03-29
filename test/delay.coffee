# require

$$ = require './../index'
{$, _} = $$.library

# variable

temp = './temp'

# function

clean = -> await $$.remove temp

# test

describe '$$.delay([time], [callback])', ->

  it '$$.delay()', ->
    await clean()

    unless _.isFunction $$.delay
      throw new Error()

    await clean()