# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

###

  check(source, target, contSource)
  clean()

###

check = co (source, target, contSource) ->

  if yield $$.isExisted source
    throw new Error 'source'

  unless yield $$.isExisted target
    throw new Error 'target'

  contTarget = yield $$.read target
  if contTarget != contSource
    throw new Error 'cont'

clean = co -> yield $$.remove './temp'

# test

###

  ‘./temp/a.txt’, 'b.txt'
  './temp/a.txt', {extname: '.md', suffix: '-test'}
  './temp/*.txt', extname: '.md'

  './temp/a', 'b'
  './temp/a', suffix: '-test'
  './temp/**', suffix: '-test'

###

describe '$$.rename(source, option)', ->

  it "$$.rename('./temp/a.txt', 'b.txt')", co ->

    source = './temp/a.txt'
    target = './temp/b.txt'
    contSource = 'to be renamed'

    yield $$.write source, contSource

    res = yield $$.rename source, 'b.txt'

    if res != $$
      throw new Error()

    yield check source, target, contSource

    yield clean()

  it "$$.rename('./temp/a.txt', {extname: '.md', suffix: '-test'})", co ->

    source = './temp/a.txt'
    target = './temp/a-test.md'
    contSource = 'to be renamed'

    yield $$.write source, contSource

    res = yield $$.rename source,
      extname: '.md'
      suffix: '-test'

    if res != $$
      throw new Error()

    yield check source, target, contSource

    yield clean()

  it "$$.rename('./temp/*.txt', extname: '.md')", co ->

    listFilename = ($.parseString i for i in [0...5])

    for filename in listFilename
      source = "./temp/#{filename}.txt"
      contSource = filename
      yield $$.write source, contSource

    res = yield $$.rename './temp/*.txt',
      extname: '.md'

    if res != $$
      throw new Error()

    for filename in listFilename

      source = "./temp/#{filename}.txt"
      target = "./temp/#{filename}.md"
      contSource = filename
      
      yield check source, target, contSource

    yield clean()