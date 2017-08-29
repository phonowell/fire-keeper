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

  it "$$.replace('./temp/**/*.txt', 'to be replaced', 'replaced')", co ->

    yield clean()

    sourceData = 'to be replaced'
    targetData = 'replaced'

    yield $$.write './temp/a.txt', sourceData
    yield $$.write './temp/b.txt', sourceData
    yield $$.write './temp/c.txt', sourceData
    yield $$.write './temp/d.txt', sourceData

    yield $$.replace './temp/**/*.txt', sourceData, targetData

    isExisted = yield $$.isExisted './temp/**'
    if isExisted
      throw new Error 1

    for filename in 'a b c d'.split ' '

      cont = yield $$.read "./temp/#{filename}.txt"

      if cont != targetData
        throw new Error 2

    yield clean()
