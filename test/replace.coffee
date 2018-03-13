# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

###
replace(source, option...)
###

describe '$$.replace(source, option...)', ->

  it "$$.replace('./temp/*.txt', 'to be replaced', 'replaced')", ->

    await clean()

    listName = ['a', 'b', 'c', 'd']

    sourceData = 'to be replaced'
    targetData = 'replaced'

    for filename in listName
      await $$.write "./temp/#{filename}.txt", sourceData

    res = await $$.replace './temp/*.txt', sourceData, targetData

    if res != $$
      throw new Error()

    for filename in listName

      cont = await $$.read "./temp/#{filename}.txt"

      if cont != targetData
        throw new Error()

    await clean()

  it "$$.replace('./temp/*.json', (cont) -> ...)", ->

    await clean()

    listKey = [
      'a'
      'b'
      'c'
    ]

    for key in listKey
      data =
        content: key
      await $$.write "./temp/#{key}.json", data

    res = await $$.replace './temp/*.json', (cont) ->
      data = $.parseJson cont
      data.content += ' new'
      data

    if res != $$
      throw new Error()

    for key in listKey

      cont = await $$.read "./temp/#{key}.json"
      data = $.parseJson cont

      if data.content != "#{key} new"
        throw new Error()

    await clean()