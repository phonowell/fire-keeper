# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.move_(source, target)', ->

  it "$.move_('#{temp}/*.md', '#{temp}/test')", ->
    await clean_()

    await $.copy_ [
      './license.md'
      './readme.md'
    ], temp

    source = "#{temp}/*.md"
    target = [
      "#{temp}/test/license.md"
      "#{temp}/test/readme.md"
    ]

    res = await $.move_ "#{temp}/*.md", "#{temp}/test"

    if res != $
      thrwo new Error()

    if await $.isExisted_ source
      throw new Error()

    unless await $.isExisted_ target
      throw new Error()

    await clean_()