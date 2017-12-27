# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.zip(source, [target], [option])', ->

  it "$$.zip('./temp/*.txt', './temp', 'temp.zip')", co ->

    yield clean()

    base = './temp'

    for key in ['a', 'b', 'c']

      source = "#{base}/[test](test)#{key}.txt"
      content = "test file #{key}"

      yield $$.write source, content

    res = yield $$.zip './temp/*.txt', './temp', 'temp.zip'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/temp.zip'
      throw new Error()

    yield clean()