# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.zip(source, [target], [option])', ->

  it "$$.zip('./temp/*.md')", co ->

    yield $$.copy './*.md', './temp'

    res = yield $$.zip './temp/*.md'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/temp.zip'
      throw new Error()

    yield clean()
