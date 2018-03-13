# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.chain(fn, option)', ->

  it '$$.chain()', ->

    await clean()

    if $.type($$.chain) != 'function'
      throw new Error()

    await clean()