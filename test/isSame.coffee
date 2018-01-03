# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.isSame(source)', ->

  it "$$.isSame(['./readme.md', './temp/a.md', './temp/b.md'])", ->

    listSource = [
      './readme.md'
      './temp/a.md'
      './temp/b.md'
    ]

    await $$.copy listSource[0], './temp', 'a.md'
    await $$.copy listSource[0], './temp', 'b.md'

    res = await $$.isSame listSource

    if !res
      throw new Error()

    await clean()

  it "$$.isSame(['./temp/null.txt', './readme.md'])", ->

    res = await $$.isSame ['./temp/null/txt', './readme.md']

    if res
      throw new Error()