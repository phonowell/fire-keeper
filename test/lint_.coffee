# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.lint_(source)', ->

  it '$.lint_()', ->

    type = $.type $.lint_
    unless type == 'async function'
      throw new Error "invalid type '#{type}'"