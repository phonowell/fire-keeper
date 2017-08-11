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
  $$.rename(source, option)
  $$.replace(pathSource, [pathTarget], target, replacement)
  $$.rm(source)
  $$.unzip(source, [target])
  $$.write(source, data)
  $$.zip(source, [target], [option])

###

describe '$$.backup(source)', ->

  it "$$.backup('./temp/readme.md')", co ->

    source = './temp/readme.md'
    target = './temp/readme.md.bak'

    yield $$.copy './readme.md', './temp'

    res = yield $$.backup source

    if res != $$
      throw new Error()

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

    res = yield $$.compile './temp/readme.md'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/readme.html'
      throw new Error()

    # clean
    yield $$.remove './temp'

  it "$$.compile('./temp/coffeelint.yaml')", co ->

    yield $$.copy './coffeelint.yaml', './temp'

    res = yield $$.compile './temp/coffeelint.yaml'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/coffeelint.json'
      throw new Error()

    # clean
    yield $$.remove './temp'

  it "$$.compile('./temp/gulpfile.coffee')", co ->

    yield $$.copy './gulpfile.coffee', './temp'

    res = yield $$.compile './temp/gulpfile.coffee'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/gulpfile.js'
      throw new Error()

    # clean
    yield $$.remove './temp'

describe '$$.copy(source, target, [option])', ->

  it "$$.copy('./license.md', './temp', 'test.md')", co ->

    source = './license.md'
    target = './temp/test.md'

    res = yield $$.copy source, './temp', 'test.md'

    if res != $$
      throw new Error()

    unless yield $$.isExisted target
      throw new Error()

    sourceData = yield $$.read source
    targetData = yield $$.read target

    if sourceData.toString() != targetData.toString()
      throw new Error()

    # clean
    yield $$.remove './temp'

  it "$$.copy('./license.md', './temp/new')", co ->

    source = './license.md'
    target = './temp/new/license.md'

    res = yield $$.copy source, './temp/new'

    if res != $$
      throw new Error()

    unless yield $$.isExisted target
      throw new Error()

    sourceData = yield $$.read source
    targetData = yield $$.read target

    if sourceData.toString() != targetData.toString()
      throw new Error()

    # clean
    yield $$.remove './temp'

  it "$$.copy('./license.md', '~/Downloads/temp')", co ->

    if $$.os != 'macos' then return

    source = './license.md'
    target = '~/Downloads/temp/license.md'

    res = yield $$.copy source, '~/Downloads/temp'

    if res != $$
      throw new Error()

    unless yield $$.isExisted target
      throw new Error()

    sourceData = yield $$.read source
    targetData = yield $$.read target

    if sourceData.toString() != targetData.toString()
      throw new Error()

    # clean
    yield $$.remove '~/Downloads/temp'

describe '$$.cp(source, target, [option])', ->

  it '$$.cp()', ->

    if $$.cp != $$.copy
      throw new Error()

describe '$$.delay([time])', ->

  it '$$.delay(1e3)', co ->

    st = _.now()

    res = yield $$.delay 1e3

    if res != $$
      throw new Error()

    ct = _.now()

    unless 900 < ct - st < 1100
      throw new Error()

describe '$$.download(source, target, [option])', ->

  it "$$.download('http://anitama.cn', './temp', 'anitama.html')", co ->

    res = yield $$.download 'http://anitama.cn'
    , './temp'
    , 'anitama.html'

    if res != $$
      throw new Error()

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

    res = yield $$.link './../gurumin/source'
    , './temp/gurumin'

    if res != $$
      throw new Error()

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

    res = yield $$.mkdir './temp/m/k/d/i/r'

    if res != $$
      throw new Error()

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

  it "$$.read('./temp/null.txt')", co ->

    cont = yield $$.read './temp/null.txt'

    if cont?
      throw new Error()

describe '$$.recover(source)', ->

  it "$$.recover('./temp/readme.md')", co ->

    source = './temp/readme.md'
    target = './temp/readme.md.bak'

    yield $$.copy './readme.md', './temp'

    yield $$.backup source

    targetData = yield $$.read target

    yield $$.remove source

    res = yield $$.recover source

    if res != $$
      throw new Error()

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

    res = yield $$.remove './temp/re'

    if res != $$
      throw new Error()

    if yield $$.isExisted './temp/re'
      throw new Error()

    # clean
    yield $$.remove './temp'

describe '$$.rename(source, option)', ->

  it "$$.rename('./temp/rename.txt')", co ->

    source = './temp/rename.txt'
    target = './temp/renamed.txt'
    string = 'to be renamed'

    yield $$.write source, string

    res = yield $$.rename source, 'renamed.txt'

    if res != $$
      throw new Error()

    if yield $$.isExisted source
      throw new Error()

    unless yield $$.isExisted target
      throw new Error()

    cont = yield $$.read target

    if cont != string
      throw new Error()

    # clean
    yield $$.remove './temp'

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

    # clean
    yield $$.remove './temp'

describe '$$.rm(source)', ->

  it '$$.rm()', ->

    if $$.rm != $$.remove
      throw new Error()

describe '$$.unzip(source, [target])', ->

  it "$$.unzip('./temp/temp.zip')", co ->

    yield $$.copy './*.md', './temp'

    yield $$.zip './temp/*.md'

    res = yield $$.unzip './temp/temp.zip'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/temp'
      throw new Error()

    unless yield $$.isExisted './temp/temp/license.md'
      throw new Error()

    unless yield $$.isExisted './temp/temp/readme.md'
      throw new Error()

    # clean
    yield $$.remove './temp'

describe '$$.write(source, data)', ->

  it "$$.write('./temp/wr/ite.txt', 'a test message')", co ->

    source = './temp/wr/ite.txt'
    string = 'a test message'

    res = yield $$.write source, string

    if res != $$
      throw new Error()

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

    res = yield $$.write source, object

    if res != $$
      throw new Error()

    unless yield $$.isExisted source
      throw new Error()

    cont = yield $$.read source

    if cont.message != string
      throw new Error()

    # clean
    yield $$.remove './temp'

describe '$$.zip(source, [target], [option])', ->

  it "$$.zip('./temp/*.md')", co ->

    yield $$.copy './*.md', './temp'

    res = yield $$.zip './temp/*.md'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/temp.zip'
      throw new Error()

    # clean
    yield $$.remove './temp'