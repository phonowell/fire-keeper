# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.say_(text)', ->

  it '$.say_()', ->

    type = $.type $.say_
    unless type == 'async function'
      throw new Error "invalid type '#{type}'"

    res = await $.say_ 'a test message'
    unless res == $
      throw new Error()
