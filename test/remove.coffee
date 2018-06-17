# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.remove_(source)', ->

  it "$.remove_('#{temp}/re')", ->
    await clean_()

    await $.write_ "#{temp}/re/move.txt", 'to be removed'

    res = await $.remove_ "#{temp}/re"

    if res != $
      throw new Error()

    if await $.isExisted_ "#{temp}/re"
      throw new Error()

    await clean_()

  it "$.remove_(['#{temp}/a', '#{temp}/b', '#{temp}/c.txt'])", ->
    await clean_()

    await $.mkdir_ [
      "#{temp}/a"
      "#{temp}/b"
    ]

    await $.write_ "#{temp}/c.txt", 'empty'

    listSource = [
      "#{temp}/a"
      "#{temp}/b"
      "#{temp}/c.txt"
    ]

    res = await $.remove_ listSource

    if res != $
      throw new Error()

    if await $.isExisted_ listSource
      throw new Error()

    await clean_()
    
  it "$.remove_('#{temp}/**/*.txt')", ->
    await clean_()
    
    listSource = [
      "#{temp}/a.txt"
      "#{temp}/b/c.txt"
    ]
    string = 'empty'

    for source in listSource
      await $.write_ source, string
    
    res = await $.remove_ "#{temp}/**/*.txt"
    
    if res != $
      throw new Error()
      
    if await $.isExisted_ listSource
      throw new Error()

    unless await $.isExisted_ "#{temp}/b"
      throw new Error()

    await clean_()