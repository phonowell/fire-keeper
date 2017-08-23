# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

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
