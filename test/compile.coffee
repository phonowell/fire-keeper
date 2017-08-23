# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

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
