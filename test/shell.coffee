# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.shell(cmd, [option])', ->

  it '$$.shell()', ->

    unless _.isFunction $$.shell
      throw new Error()