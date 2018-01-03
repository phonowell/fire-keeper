# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.recover(source)', ->

  it "$$.recover('./temp/readme.md')", ->

    await clean()

    source = './temp/readme.md'
    target = './temp/readme.md.bak'

    await $$.copy './readme.md', './temp'

    await $$.backup source

    targetData = await $$.read target

    await $$.remove source

    res = await $$.recover source

    if res != $$
      throw new Error()

    unless await $$.isExisted source
      throw new Error 1

    sourceData = await $$.read source

    if sourceData.toString() != targetData.toString()
      throw new Error 2

    await clean()