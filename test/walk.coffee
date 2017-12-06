# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.walk(source, callback)', ->

  it "$$.walk('./temp')", co ->

    yield $$.mkdir './temp/a'

    string = 'empty'

    yield $$.write './temp/b/c.txt', string
    yield $$.write './temp/d.txt', string

    listResult = []

    res = yield $$.walk './temp', (item) ->
      listResult.push item.path

    if res != $$
      throw new Error()

    unless _.isEqual listResult, $$.fn.formatPath [
      './temp'
      './temp/a'
      './temp/b'
      './temp/d.txt'
      './temp/b/c.txt'
    ]
      throw new Error()

    yield clean()