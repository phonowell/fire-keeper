# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.read(source, [option])', ->

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

  it "$$.read('./temp/text.txt', raw: true)", co ->

    source = './temp/test.json'
    string = 'a test message'

    yield $$.write source, string

    cont = yield $$.read source,
      raw: true

    if $.type(cont) != 'buffer'
      throw new Error()

    cont = $.parseString cont

    if cont != string
      throw new Error()

    yield clean()