# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.remove(source)', ->

  it "$$.remove('./temp/re')", co ->

    yield $$.write './temp/re/move.txt', 'to be removed'

    res = yield $$.remove './temp/re'

    if res != $$
      throw new Error()

    if yield $$.isExisted './temp/re'
      throw new Error()

    yield clean()
