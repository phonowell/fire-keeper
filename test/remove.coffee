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


  it "$$.remove(['./temp/a', './temp/b', './temp/c.txt'])", co ->

    yield $$.mkdir [
      './temp/a'
      './temp/b'
    ]

    yield $$.write './temp/c.txt', 'empty'

    sourceList = [
      './temp/a'
      './temp/b'
      './temp/c.txt'
    ]

    res = yield $$.remove sourceList

    if res != $$
      throw new Error()

    if yield $$.isExisted sourceList
      throw new Error()

    yield clean()
