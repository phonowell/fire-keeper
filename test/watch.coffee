# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.watch()', ->

  it '$.watch()', ->
    await clean_()

    type = $.type $.watch
    unless type == 'function'
      throw new Error()

    await clean_()