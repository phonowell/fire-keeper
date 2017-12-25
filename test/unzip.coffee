# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.unzip(source, [target])', ->

  it "$$.unzip('./temp/*.zip')", co ->

    yield clean()

    base = './temp'

    listSource = []
    for key in ['a', 'b', 'c']

      source = "#{base}/[test](test)#{key}.txt"
      content = "test file #{key}"

      yield $$.write source, content
      yield $$.zip source, "#{key}.zip"
      yield $$.remove source

      listSource.push source

    res = yield $$.unzip "#{base}/*.zip"

    if res != $$
      throw new Error()

    unless yield $$.isExisted listSource
      throw new Error()

    yield clean()