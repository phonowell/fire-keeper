# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.remove(source)', ->

  it "$$.remove('./temp/re')", co ->

    yield $$.write './temp/re/move.txt', 'to be removed'

    res = yield $$.remove './temp/re'

    if res != $$
      throw new Error()

    if yield $$.isExisted './temp/re'
      throw new Error()

    yield clean()


  it "$$.remove(['./temp/a', './temp/b', './temp/c.txt'])", co ->

    yield $$.mkdir [
      './temp/a'
      './temp/b'
    ]

    yield $$.write './temp/c.txt', 'empty'

    listSource = [
      './temp/a'
      './temp/b'
      './temp/c.txt'
    ]

    res = yield $$.remove listSource

    if res != $$
      throw new Error()

    if yield $$.isExisted listSource
      throw new Error()

    yield clean()
    
  it "$$.remove('./temp/**/*.txt')", co ->
    
    listSource = [
      './temp/a.txt'
      './temp/b/c.txt'
    ]
    string = 'empty'

    for source in listSource
      yield $$.write source, string
    
    res = yield $$.remove './temp/**/*.txt'
    
    if res != $$
      throw new Error()
      
    if yield $$.isExisted listSource
      throw new Error()

    unless yield $$.isExisted './temp/b'
      throw new Error()

    yield clean()
