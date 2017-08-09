# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# test

###

  $$.backup(source)
  $$.compile(source, [target], [option])
  $$.isExisted(source)
  $$.link(source, target)
  $$.mkdir(source)
  $$.read(source)
  $$.remove(source)

###

describe '$$.backup(source)', ->

  it "$$.backup('./temp/readme.md')", co ->

    yield $$.copy './readme.md', './temp'

    yield $$.backup './temp/readme.md'

    unless yield $$.isExisted './temp/readme.md.bak'
      throw new Error()

    sourceData = yield $$.read './temp/readme.md'
    targetData = yield $$.read './temp/readme.md.bak'

    unless sourceData.toString() == targetData.toString()
      throw new Error()

    # clean
    yield $$.remove './temp'

describe '$$.compile(source, [target], [option])', ->

  it "$$.compile('./temp/readme.md')", co ->

    yield $$.copy './readme.md', './temp'

    yield $$.compile './temp/readme.md'

    unless yield $$.isExisted './temp/readme.html'
      throw new Error()

    # clean
    yield $$.remove './temp'

describe '$$.isExisted(source)', ->

  it "$$.isExisted('./temp/existed')", co ->

    yield $$.mkdir './temp/existed'

    unless yield $$.isExisted './temp/existed'
      throw new Error()

    # clean
    yield $$.remove './temp'

  it "$$.isExisted('./temp/null')", co ->

    if yield $$.isExisted './temp/null'
      throw new Error()

    # clean
    yield $$.remove './temp'

  it "$$.isExisted('./temp/existed/existed.txt')", co ->

    yield $$.write './temp/existed/existed.txt', 'existed'

    unless yield $$.isExisted './temp/existed/existed.txt'
      throw new Error()

    # clean
    yield $$.remove './temp'

  it "$$.isExisted('./temp/existed/null.txt')", co ->

    yield $$.mkdir './temp/existed'

    if yield $$.isExisted './temp/existed/null.txt'
      throw new Error()

    # clean
    yield $$.remove './temp'


describe '$$.link(source, target)', ->

  it "$$.link('./../gurumin/source', './temp/gurumin')", co ->

    yield $$.link './../gurumin/source'
    , './temp/gurumin'

    unless yield $$.isExisted './temp/gurumin'
      throw new Error()

    unless yield $$.isExisted './temp/gurumin/script/include/core/$.ago.coffee'
      throw new Error()

    # clean
    yield $$.remove './temp'

describe '$$.mkdir(source)', ->

  it "$$.mkdir('./temp/m/k/d/i/r')", co ->

    yield $$.mkdir './temp/m/k/d/i/r'

    unless yield $$.isExisted './temp/m/k/d/i/r'
      throw new Error()

    # clean
    yield $$.remove './temp'

describe '$$.read(source)', ->

  it "$$.read('./temp/test.txt')", co ->

    string = 'a test message'

    yield $$.write './temp/test.txt', string

    cont = yield $$.read './temp/test.txt'

    unless cont == string
      throw new Error()

    # clean
    yield $$.remove './temp'

  it "$$.read('./temp/test.json')", co ->

    string = 'a test message'
    object = message: string

    yield $$.write './temp/test.json', object

    cont = yield $$.read './temp/test.json'

    unless cont.message == string
      throw new Error()

    # clean
    yield $$.remove './temp'

describe '$$.remove(source)', ->

  it "$$.remove('./temp/re')", co ->

    yield $$.write './temp/re/move.txt', 'to be removed'

    yield $$.remove './temp/re'

    if yield $$.isExisted './temp/re'
      throw new Error()

    # clean
    yield $$.remove './temp'