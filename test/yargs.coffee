# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.yargs()', ->

  it '$$.yargs()', ->

    if $$.yargs != $$.plugin.yargs
      throw new Error()

    unless _.isFunction $$.yargs
      throw new Error()