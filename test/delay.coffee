# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.delay_([time], [callback])', ->

  it '$.delay_()', ->
    await clean_()

    unless _.isFunction $.delay_
      throw new Error()

    await clean_()