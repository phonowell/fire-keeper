# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.link_(source, target)', ->

  it "$.link_('./source', '#{temp}/source')", ->
    await clean_()

    res = await $.link_ './source'
    , "#{temp}/source"

    unless res == $
      throw new Error 0

    unless await $.isExisted_ "#{temp}/source"
      throw new Error 1

    unless await $.isExisted_ "#{temp}/source/include/file.coffee"
      throw new Error 2

    await clean_()