# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.compile(source, [target], [option])', ->

  it "$$.compile('./readme.md')", co ->

    res = yield $$.compile './readme.md', './temp'

    if res != $$
      throw new Error 1

    unless yield $$.isExisted './temp/readme.html'
      throw new Error 2

    yield clean()

  it "$$.compile('./temp/test.yaml')", co ->

    source = './temp/test.yaml'

    yield $$.write source, 'test: true'

    res = yield $$.compile source

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/test.json'
      throw new Error()

    yield clean()

  it "$$.compile('./gulpfile.coffee')", co ->

    res = yield $$.compile './gulpfile.coffee', './temp'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/gulpfile.js'
      throw new Error()

    yield clean()

  it "$$.compile(['./temp/*.md', '!./temp/a.md'])", co ->

    yield clean()

    data = 'empty'

    yield $$.write './temp/a.md', data
    yield $$.write './temp/b.md', data

    res = yield $$.compile [
      './temp/*.md'
      '!./temp/a.md'
    ]

    if res != $$
      throw new Error 1

    isExisted = yield $$.isExisted './temp/a.html'
    if isExisted
      throw new Error 2

    isExisted = yield $$.isExisted './temp/b.html'
    if !isExisted
      throw new Error 3

    yield clean()
