# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.stat(source)', ->

  it '$$.stat("./temp/package.json")', co ->

    yield $$.copy './package.json', './temp'

    stat = yield $$.stat './package.json'

    if $.type(stat) != 'object'
      throw new Error()

    if $.type(stat.atime) != 'date'
      throw new Error()

    if $.type(stat.size) != 'number'
      throw new Error()

    yield clean()

  it '$$.stat("./temp/null.txt")', co ->

    stat = yield $$.stat './temp/null.txt'

    if stat?
      throw new Error()
