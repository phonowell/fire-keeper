# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.backup(source)', ->

  it "$$.backup('./temp/readme.md')", co ->

    source = './temp/readme.md'
    target = './temp/readme.md.bak'

    yield $$.copy './readme.md', './temp'

    res = yield $$.backup source

    if res != $$
      throw new Error()

    unless yield $$.isExisted target
      throw new Error()

    sourceData = yield $$.read source
    targetData = yield $$.read target

    if sourceData.toString() != targetData.toString()
      throw new Error()

    yield clean()
