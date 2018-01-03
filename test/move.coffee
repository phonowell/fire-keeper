# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.move(source, target)', ->

  it "$$.move('./temp/*.md', './temp/test')", ->

    await clean()

    await $$.copy [
      './license.md'
      './readme.md'
    ], './temp'

    source = './temp/*.md'
    target = [
      './temp/test/license.md'
      './temp/test/readme.md'
    ]

    res = await $$.move './temp/*.md', './temp/test'

    if res != $$
      thrwo new Error()

    if await $$.isExisted source
      throw new Error()

    unless await $$.isExisted target
      throw new Error()

    await clean()