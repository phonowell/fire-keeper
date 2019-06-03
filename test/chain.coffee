# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.chain(fn, option)', ->

  it '$.chain()', ->
    await clean_()

    if $.type($.chain) != 'function'
      throw new Error()

    await clean_()
