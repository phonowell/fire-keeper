# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.exec_(cmd, [option])', ->

  it '$.exec_()', ->
    await clean_()

    type = $.type $.exec_
    unless type == 'async function'
      throw new Error()

    await clean_()