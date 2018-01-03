# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

###

  replace(pathSource, [pathTarget], target, replacement)

###

describe '$$.replace(pathSource, [pathTarget], target, replacement)', ->

  it "$$.replace('./temp/replace.txt', 'to be replaced', 'replaced')", ->

    source = './temp/replace.txt'
    sourceData = 'to be replaced'
    targetData = 'replaced'

    await $$.write source, sourceData

    res = await $$.replace source, sourceData, targetData

    if res != $$
      throw new Error()

    cont = await $$.read source

    if cont != targetData
      throw new Error()

    await clean()

  it "$$.replace('./temp/**/*.txt', 'to be replaced', 'replaced')", ->

    await clean()

    listName = ['a', 'b', 'c', 'd']

    sourceData = 'to be replaced'
    targetData = 'replaced'

    for filename in listName
      await $$.write "./temp/#{filename}.txt", sourceData

    await $$.replace './temp/**/*.txt', sourceData, targetData

    isExisted = await $$.isExisted './temp/**'
    if isExisted
      throw new Error 1

    for filename in listName

      cont = await $$.read "./temp/#{filename}.txt"

      if cont != targetData
        throw new Error 2

    await clean()