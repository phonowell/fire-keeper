# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.link(source, target)', ->

  it "$$.link('./../gurumin/source', './temp/gurumin')", co ->

    res = yield $$.link './../gurumin/source'
    , './temp/gurumin'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/gurumin'
      throw new Error()

    unless yield $$.isExisted './temp/gurumin/script/include/core/$.ago.coffee'
      throw new Error()

    yield clean()
