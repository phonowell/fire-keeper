# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

###

  backup(source)
  compile(source, [target], [option])
  copy(source, target, [option])
  delay([time])
  download(source, target, [option])
  isExisted(source)
  isSame(list)
  link(source, target)
  mkdir(source)
  read(source)
  recover(source)
  reload(source)
  remove(source)
  rename(source, option)
  replace(pathSource, [pathTarget], target, replacement)
  shell(cmd)
  stat(source)
  unzip(source, [target])
  watch(source)
  write(source, data, [option])
  yargs()
  zip(source, [target], [option])

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

    yield clean()

describe '$$.compile(source, [target], [option])', ->

  it "$$.compile('./temp/readme.md')", co ->

    yield $$.copy './readme.md', './temp'

    res = yield $$.compile './temp/readme.md'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/readme.html'
      throw new Error()

    yield clean()

  it "$$.compile('./temp/coffeelint.yaml')", co ->

    yield $$.copy './coffeelint.yaml', './temp'

    res = yield $$.compile './temp/coffeelint.yaml'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/coffeelint.json'
      throw new Error()

    yield clean()

  it "$$.compile('./temp/gulpfile.coffee')", co ->

    yield $$.copy './gulpfile.coffee', './temp'

    res = yield $$.compile './temp/gulpfile.coffee'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/gulpfile.js'
      throw new Error()

    yield clean()

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

    yield clean()

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

    yield clean()

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

    yield $$.remove '~/Downloads/temp'

describe '$$.delay([time])', ->

  it '$$.delay()', ->

    if $$.delay != $.delay
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

    yield clean()

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

describe '$$.isSame(list)', ->

  it "$$.isSame(['./readme.md', './temp/a.md', './temp/b.md'])", co ->

    sourceList = [
      './readme.md'
      './temp/a.md'
      './temp/b.md'
    ]

    yield $$.copy sourceList[0], './temp', 'a.md'
    yield $$.copy sourceList[0], './temp', 'b.md'

    res = yield $$.isSame sourceList

    if !res
      throw new Error()

    yield clean()

  it "$$.isSame(['./temp/null.txt', './readme.md'])", co ->

    res = yield $$.isSame ['./temp/null/txt', './readme.md']

    if res
      throw new Error()

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

    yield clean()

describe '$$.mkdir(source)', ->

  it "$$.mkdir('./temp/m/k/d/i/r')", co ->

    res = yield $$.mkdir './temp/m/k/d/i/r'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/m/k/d/i/r'
      throw new Error()

    yield clean()

  it "$$.mkdir(['./temp/a', './temp/b', './temp/c'])", co ->

    sourceList = [
      './temp/a'
      './temp/b'
      './temp/c'
    ]

    res = yield $$.mkdir sourceList

    if res != $$
      throw new Error()

    isExisted = yield $$.isExisted [
      './temp/a'
      './temp/b'
      './temp/c'
    ]

    if !isExisted
      throw new Error()

    yield clean()

describe '$$.read(source)', ->

  it "$$.read('./temp/test.txt')", co ->

    source = './temp/test.txt'
    string = 'a test message'

    yield $$.write source, string

    cont = yield $$.read source

    if cont != string
      throw new Error()

    yield clean()

  it "$$.read('./temp/test.json')", co ->

    source = './temp/test.json'
    string = 'a test message'
    object = message: string

    yield $$.write source, object

    cont = yield $$.read source

    if cont.message != string
      throw new Error()

    yield clean()

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

    yield clean()

describe '$$.reload(source)', ->

  it '$$.reload()', ->

    if !$$.reload
      throw new Error()

describe '$$.remove(source)', ->

  it "$$.remove('./temp/re')", co ->

    yield $$.write './temp/re/move.txt', 'to be removed'

    res = yield $$.remove './temp/re'

    if res != $$
      throw new Error()

    if yield $$.isExisted './temp/re'
      throw new Error()

    yield clean()

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

    yield clean()

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

describe '$$.shell()', ->

  it '$$.shell()', ->

    if $$.shell != $.shell
      throw new Error()

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

    yield clean()

describe '$$.watch()', ->

  it '$$.watch()', ->

    if $$.watch != $$.plugin.watch
      throw new Error()

describe '$$.write(source, data, [option])', ->

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

    yield clean()

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

    yield clean()

describe '$$.yargs()', ->

  it '$$.yargs()', ->

    if $$.yargs != $$.plugin.yargs
      throw new Error()

describe '$$.zip(source, [target], [option])', ->

  it "$$.zip('./temp/*.md')", co ->

    yield $$.copy './*.md', './temp'

    res = yield $$.zip './temp/*.md'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/temp.zip'
      throw new Error()

    yield clean()