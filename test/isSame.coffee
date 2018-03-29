# require

$$ = require './../index'
{$, _} = $$.library

# variable

temp = './temp'

# function

clean = -> await $$.remove temp

# test

describe '$$.isSame(source)', ->

  it "$$.isSame(['./readme.md', '#{temp}/a.md', '#{temp}/b.md'])", ->
    await clean()

    listSource = [
      './readme.md'
      "#{temp}/a.md"
      "#{temp}/b.md"
    ]

    await $$.copy listSource[0], temp, 'a.md'
    await $$.copy listSource[0], temp, 'b.md'

    res = await $$.isSame listSource

    if !res
      throw new Error()

    await clean()

  it "$$.isSame(['#{temp}/null.txt', './readme.md'])", ->
    await clean()

    res = await $$.isSame ["#{temp}/null/txt", './readme.md']

    if res
      throw new Error()

    await clean()