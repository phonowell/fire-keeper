# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.source(source)', ->

  it "$$.source('./*.md')", co ->

    listSource = yield $$.source './*.md'

    if listSource.length != 2
      throw new Error()
