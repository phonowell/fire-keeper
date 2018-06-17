# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

###
replace(source, option...)
###

describe '$.replace_(source, option...)', ->

  it "$.replace_('#{temp}/*.txt', 'to be replaced', 'replaced')", ->
    await clean_()

    listName = ['a', 'b', 'c', 'd']

    sourceData = 'to be replaced'
    targetData = 'replaced'

    for filename in listName
      await $.write_ "./temp/#{filename}.txt", sourceData

    res = await $.replace_ "#{temp}/*.txt", sourceData, targetData

    if res != $
      throw new Error()

    for filename in listName

      cont = await $.read_ "./temp/#{filename}.txt"

      if cont != targetData
        throw new Error()

    await clean_()

  it "$.replace_('#{temp}/*.json', (cont) -> ...)", ->
    await clean_()

    listKey = [
      'a'
      'b'
      'c'
    ]

    for key in listKey
      data =
        content: key
      await $.write_ "./temp/#{key}.json", data

    res = await $.replace_ "#{temp}/*.json", (cont) ->
      data = $.parseJson cont
      data.content += ' new'
      data

    if res != $
      throw new Error()

    for key in listKey

      cont = await $.read_ "./temp/#{key}.json"
      data = $.parseJson cont

      if data.content != "#{key} new"
        throw new Error()

    await clean_()