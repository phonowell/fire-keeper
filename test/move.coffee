# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.move(source, target)', ->

  it "$$.move('./temp/*.md', './temp/test')", co ->

    yield clean()

    yield $$.copy [
      './license.md'
      './readme.md'
    ], './temp'

    source = './temp/*.md'
    target = [
      './temp/test/license.md'
      './temp/test/readme.md'
    ]

    res = yield $$.move './temp/*.md', './temp/test'

    if res != $$
      thrwo new Error()

    if yield $$.isExisted source
      throw new Error()

    unless yield $$.isExisted target
      throw new Error()

    yield clean()
