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

    await $.chain $
    .copy_ './readme.md', temp
    .backup_ source
    .remove_ source

    res = await $.recover_ source
    unless res == $
      throw new Error 0

    unless await $.isExisted_ source
      throw new Error 1

    await clean_()