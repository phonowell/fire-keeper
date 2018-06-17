# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.link_(source, target)', ->

  it "$.link_('./../gurumin/source', '#{temp}/gurumin')", ->
    await clean_()

    res = await $.link_ './../gurumin/source'
    , "#{temp}/gurumin"

    if res != $
      throw new Error()

    unless await $.isExisted_ "#{temp}/gurumin"
      throw new Error()

    unless await $.isExisted_ "#{temp}/gurumin/script/include/core/$.ago.coffee"
      throw new Error()

    await clean_()