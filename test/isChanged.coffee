# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.isChanged(source)', ->

  it "$$.isChanged('./temp/isChanged.txt')", co ->

    yield clean()

    source = './temp/isChanged.txt'
    string = 'message to be changed'

    yield $$.write source, string

    res = yield $$.isChanged source

    if res != true
      throw new Error 1

    res = yield $$.isChanged source

    if res != false
      throw new Error 2

    string = 'message changed'

    yield $$.write source, string

    res = yield $$.isChanged source

    if res != true
      throw new Error 3

    yield clean()

  it "$$.isChanged('./temp/null.txt')", co ->

    yield clean()

    res = yield $$.isChanged './temp/null.txt'

    if res != false
      throw new Error()
