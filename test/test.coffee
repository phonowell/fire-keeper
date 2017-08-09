# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# test

###

  $$.backup(source)
  $$.compile(source, [target], [option])
  $$.copy(source, target, [option])
  $$.cp(source, target, [option])
  $$.delay([time])
  $$.download(source, target, [option])
  $$.isExisted(source)
  $$.link(source, target)
  $$.ln(source, target)
  $$.mkdir(source)
  $$.read(source)
  $$.recover(source)
  $$.remove(source)
  $$.rm(source)
  $$.write(source, data)

###

describe '$$.backup(source)', ->

  it "$$.backup('./temp/readme.md')", co ->

    source = './temp/readme.md'
    target = './temp/readme.md.bak'

    yield $$.copy './readme.md', './temp'

    yield $$.backup source

    unless yield $$.isExisted target
      throw new Error()

    sourceData = yield $$.read source
    targetData = yield $$.read target

    if sourceData.toString() != targetData.toString()
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

  it "$$.compile('./temp/coffeelint.yaml')", co ->

    yield $$.copy './coffeelint.yaml', './temp'

    yield $$.compile './temp/coffeelint.yaml'

    unless yield $$.isExisted './temp/coffeelint.json'
      throw new Error()

    # clean
    yield $$.remove './temp'

  it "$$.compile('./temp/gulpfile.coffee')", co ->

    yield $$.copy './gulpfile.coffee', './temp'

    yield $$.compile './temp/gulpfile.coffee'

    unless yield $$.isExisted './temp/gulpfile.js'
      throw new Error()

    # clean
    yield $$.remove './temp'

describe '$$.copy(source, target, [option])', ->

  it "$$.copy('./license.md', './temp', 'test.md')", co ->

    source = './license.md'
    target = './temp/test.md'

    yield $$.copy source, './temp', 'test.md'

    unless yield $$.isExisted target
      throw new Error()

    sourceData = yield $$.read source
    targetData = yield $$.read target

    if sourceData.toString() != targetData.toString()
      throw new Error()

    # clean
    yield $$.remove './temp'

describe '$$.cp(source, target, [option])', ->

  it '$$.cp()', ->

    if $$.cp != $$.copy
      throw new Error()

describe '$$.delay([time])', ->

  it '$$.delay(1e3)', co ->

    st = _.now()

    yield $$.delay 1e3

    ct = _.now()

    unless 900 < ct - st < 1100
      throw new Error()

describe '$$.download(source, target, [option])', ->

  it "$$.download('http://anitama.cn', './temp', 'anitama.html')", co ->

    yield $$.download 'http://anitama.cn'
    , './temp'
    , 'anitama.html'

    unless yield $$.isExisted './temp/anitama.html'
      throw new Error()

    # clean
    yield $$.remove './temp'

describe '$$.isExisted(source)', ->

  it "$$.isExisted('./temp/existed')", co ->

    source = './temp/existed'

    yield $$.mkdir source

    unless yield $$.isExisted source
      throw new Error()

    # clean
    yield $$.remove './temp'

  it "$$.isExisted('./temp/null')", co ->

    if yield $$.isExisted './temp/null'
      throw new Error()

    # clean
    yield $$.remove './temp'

  it "$$.isExisted('./temp/existed/existed.txt')", co ->

    source = './temp/existed/existed.txt'

    yield $$.write source, 'existed'

    unless yield $$.isExisted source
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

describe '$$.ln(source, target)', ->

  it '$$.ln()', ->

    if $$.ln != $$.link
      throw new Error()

describe '$$.mkdir(source)', ->

  it "$$.mkdir('./temp/m/k/d/i/r')", co ->

    yield $$.mkdir './temp/m/k/d/i/r'

    unless yield $$.isExisted './temp/m/k/d/i/r'
      throw new Error()

    # clean
    yield $$.remove './temp'

describe '$$.read(source)', ->

  it "$$.read('./temp/test.txt')", co ->

    source = './temp/test.txt'
    string = 'a test message'

    yield $$.write source, string

    cont = yield $$.read source

    if cont != string
      throw new Error()

    # clean
    yield $$.remove './temp'

  it "$$.read('./temp/test.json')", co ->

    source = './temp/test.json'
    string = 'a test message'
    object = message: string

    yield $$.write source, object

    cont = yield $$.read source

    if cont.message != string
      throw new Error()

    # clean
    yield $$.remove './temp'

describe '$$.recover(source)', ->

  it "$$.recover('./temp/readme.md')", co ->

    source = './temp/readme.md'
    target = './temp/readme.md.bak'

    yield $$.copy './readme.md', './temp'

    yield $$.backup source

    targetData = yield $$.read target

    yield $$.remove source

    yield $$.recover source

    unless yield $$.isExisted source
      throw new Error()

    sourceData = yield $$.read source

    if sourceData.toString() != targetData.toString()
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

describe '$$.rm(source)', ->

  it '$$.rm()', ->

    if $$.rm != $$.remove
      throw new Error()

describe '$$.write(source, data)', ->

  it "$$.write('./temp/wr/ite.txt', 'a test message')", co ->

    source = './temp/wr/ite.txt'
    string = 'a test message'

    yield $$.write source, string

    unless yield $$.isExisted source
      throw new Error()

    cont = yield $$.read source

    if cont != string
      throw new Error()

    # clean
    yield $$.remove './temp'

  it "$$.write('./temp/wr/ite.json', {message: 'a test message'})", co ->

    source = './temp/wr/ite.json'
    string = 'a test message'
    object = message: string

    yield $$.write source, object

    unless yield $$.isExisted source
      throw new Error()

    cont = yield $$.read source

    if cont.message != string
      throw new Error()

    # clean
    yield $$.remove './temp'