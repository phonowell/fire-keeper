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

    type = $.type $.delay_
    unless type == 'async function'
      throw new Error "invalid type '#{type}'"

    await clean_()