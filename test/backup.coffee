# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.backup(source)', ->

  it "$$.backup(['./temp/license.md', './temp/readme.md'])", co ->

    listSource = [
      './temp/license.md'
      './temp/readme.md'
    ]

    listTarget = [
      './temp/license.md.bak'
      './temp/readme.md.bak'
    ]

    yield $$.copy [
      './license.md'
      './readme.md'
    ], './temp'

    res = yield $$.backup listSource

    if res != $$
      throw new Error 0

    unless yield $$.isExisted listTarget
      throw new Error 1

    option = raw: true
    listSourceData = (yield $$.read source, option for source in listSource)
    listTargetData = (yield $$.read target, option for target in listTarget)

    unless _.isEqual listSourceData, listTargetData
      throw new Error 2

    yield clean()