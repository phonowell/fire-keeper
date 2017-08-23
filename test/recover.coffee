# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.recover(source)', ->

  it "$$.recover('./temp/readme.md')", co ->

    source = './temp/readme.md'
    target = './temp/readme.md.bak'

    yield $$.copy './readme.md', './temp'

    yield $$.backup source

    targetData = yield $$.read target

    yield $$.remove source

    res = yield $$.recover source

    if res != $$
      throw new Error()

    unless yield $$.isExisted source
      throw new Error()

    sourceData = yield $$.read source

    if sourceData.toString() != targetData.toString()
      throw new Error()

    yield clean()
