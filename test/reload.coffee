# require

$$ = require './../index'
{$, _} = $$.library

# variable

temp = './temp'

# function

clean = -> await $$.remove temp

# test

describe '$$.reload(source)', ->

  it '$$.reload()', ->
    await clean()

    if !$$.reload
      throw new Error()

    unless _.isFunction $$.reload
      throw new Error()

    await clean()