# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.backup(source)', ->

  it "$$.backup(['./temp/license.md', './temp/readme.md'])", ->

    listSource = [
      './temp/license.md'
      './temp/readme.md'
    ]

    listTarget = [
      './temp/license.md.bak'
      './temp/readme.md.bak'
    ]

    await $$.copy [
      './license.md'
      './readme.md'
    ], './temp'

    res = await $$.backup listSource

    if res != $$
      throw new Error 0

    unless await $$.isExisted listTarget
      throw new Error 1

    option = raw: true
    listSourceData = (await $$.read source, option for source in listSource)
    listTargetData = (await $$.read target, option for target in listTarget)

    unless _.isEqual listSourceData, listTargetData
      throw new Error 2

    await clean()