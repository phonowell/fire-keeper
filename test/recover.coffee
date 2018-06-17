# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.recover_(source)', ->

  it "$.recover_('#{temp}/readme.md')", ->
    await clean_()

    source = "#{temp}/readme.md"
    target = "#{temp}/readme.md.bak"

    await $.copy_ './readme.md', temp

    await $.backup_ source

    targetData = await $.read_ target

    await $.remove_ source

    res = await $.recover_ source

    if res != $
      throw new Error()

    unless await $.isExisted_ source
      throw new Error 1

    sourceData = await $.read_ source

    if sourceData.toString() != targetData.toString()
      throw new Error 2

    await clean_()