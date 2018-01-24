# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.shell()', ->

  it '$$.shell()', ->

    if $$.shell != $.shell
      throw new Error()

    unless _.isFunction $$.shell
      throw new Error()