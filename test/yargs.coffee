# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.yargs()', ->

  it '$$.yargs()', ->

    if $$.yargs != $$.plugin.yargs
      throw new Error()