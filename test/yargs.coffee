# require

$$ = require './../index'
{$, _} = $$.library

# variable

temp = './temp'

# function

clean = -> await $$.remove temp

# test

describe '$$.yargs()', ->

  it '$$.yargs()', ->
    await clean()

    if $$.yargs != $$.plugin.yargs
      throw new Error()

    unless _.isFunction $$.yargs
      throw new Error()

    await clean()