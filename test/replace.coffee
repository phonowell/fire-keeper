# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

###

  replace(pathSource, [pathTarget], target, replacement)

###

describe '$$.replace(pathSource, [pathTarget], target, replacement)', ->

  it "$$.replace('./temp/replace.txt', 'to be replaced', 'replaced')", co ->

    source = './temp/replace.txt'
    sourceData = 'to be replaced'
    targetData = 'replaced'

    yield $$.write source, sourceData

    res = yield $$.replace source, sourceData, targetData

    if res != $$
      throw new Error()

    cont = yield $$.read source

    if cont != targetData
      throw new Error()

    yield clean()
