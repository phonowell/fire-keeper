# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

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