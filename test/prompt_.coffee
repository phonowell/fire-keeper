# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.prompt_(source, callback)', ->

  it '$.prompt_()', ->
    await clean_()

    type = $.type $.prompt
    unless type == 'async function'
      throw new Error()

    await clean_()