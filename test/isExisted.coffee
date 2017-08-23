# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test
    
describe '$$.isExisted(source)', ->

  it "$$.isExisted('./temp/existed')", co ->

    source = './temp/existed'

    yield $$.mkdir source

    unless yield $$.isExisted source
      throw new Error()

    yield clean()

  it "$$.isExisted('./temp/null')", co ->

    if yield $$.isExisted './temp/null'
      throw new Error()

    yield clean()

  it "$$.isExisted('./temp/existed/existed.txt')", co ->

    source = './temp/existed/existed.txt'

    yield $$.write source, 'existed'

    unless yield $$.isExisted source
      throw new Error()

    yield clean()

  it "$$.isExisted('./temp/existed/null.txt')", co ->

    yield $$.mkdir './temp/existed'

    if yield $$.isExisted './temp/existed/null.txt'
      throw new Error()

    yield clean()

  it '$$.isExisted([])', co ->

    isExisted = yield $$.isExisted []

    if isExisted
      throw new Error()

  it "$$.isExisted(['./temp/a', './temp/b', './temp/c'])", co ->

    sourceList = [
      './temp/a'
      './temp/b'
      './temp/c'
    ]

    yield $$.mkdir sourceList

    isExisted = yield $$.isExisted sourceList

    if !isExisted
      throw new Error()

    yield clean()

  it "$$.isExisted(['./temp/existed.txt', './temp/null.txt'])", co ->

    sourceList = [
      './temp/existed.txt'
      './temp/null.txt'
    ]

    yield $$.write sourceList[0], 'existed'

    isExisted = yield $$.isExisted sourceList

    if isExisted
      throw new Error()

    yield clean()