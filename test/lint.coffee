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
    await clean_()

    if !$.lint_
      throw new Error()

    unless _.isFunction $.lint_
      throw new Error()

    await clean_()