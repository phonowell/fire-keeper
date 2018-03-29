# require

$$ = require './../index'
{$, _} = $$.library

# variable

temp = './temp'

# function

clean = -> await $$.remove temp

# test

describe '$$.watch()', ->

  it '$$.watch()', ->
    await clean()

    if $$.watch != $$.plugin.watch
      throw new Error()

    unless _.isFunction $$.watch
      throw new Error()

    await clean()