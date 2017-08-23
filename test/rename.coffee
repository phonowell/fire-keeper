# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

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
