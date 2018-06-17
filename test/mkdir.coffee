# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.mkdir_(source)', ->

  it "$.mkdir_('#{temp}/m/k/d/i/r')", ->
    await clean_()

    res = await $.mkdir_ "#{temp}/m/k/d/i/r"

    if res != $
      throw new Error()

    unless await $.isExisted_ "#{temp}/m/k/d/i/r"
      throw new Error()

    await clean_()

  it "$.mkdir_(['#{temp}/a', '#{temp}/b', '#{temp}/c'])", ->
    await clean_()

    listSource = [
      "#{temp}/a"
      "#{temp}/b"
      "#{temp}/c"
    ]

    res = await $.mkdir_ listSource

    if res != $
      throw new Error()

    isExisted = await $.isExisted_ [
      "#{temp}/a"
      "#{temp}/b"
      "#{temp}/c"
    ]

    if !isExisted
      throw new Error()

    await clean_()