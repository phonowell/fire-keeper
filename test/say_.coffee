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
    await clean_()

    if !$.say_
      throw new Error()

    unless _.isFunction $.say_
      throw new Error()

    await clean_()