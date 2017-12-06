# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.mkdir(source)', ->

  it "$$.mkdir('./temp/m/k/d/i/r')", co ->

    res = yield $$.mkdir './temp/m/k/d/i/r'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/m/k/d/i/r'
      throw new Error()

    yield clean()

  it "$$.mkdir(['./temp/a', './temp/b', './temp/c'])", co ->

    listSource = [
      './temp/a'
      './temp/b'
      './temp/c'
    ]

    res = yield $$.mkdir listSource

    if res != $$
      throw new Error()

    isExisted = yield $$.isExisted [
      './temp/a'
      './temp/b'
      './temp/c'
    ]

    if !isExisted
      throw new Error()

    yield clean()