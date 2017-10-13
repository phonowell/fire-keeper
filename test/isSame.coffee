# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.isSame(source)', ->

  it "$$.isSame(['./readme.md', './temp/a.md', './temp/b.md'])", co ->

    listSource = [
      './readme.md'
      './temp/a.md'
      './temp/b.md'
    ]

    yield $$.copy listSource[0], './temp', 'a.md'
    yield $$.copy listSource[0], './temp', 'b.md'

    res = yield $$.isSame listSource

    if !res
      throw new Error()

    yield clean()

  it "$$.isSame(['./temp/null.txt', './readme.md'])", co ->

    res = yield $$.isSame ['./temp/null/txt', './readme.md']

    if res
      throw new Error()
