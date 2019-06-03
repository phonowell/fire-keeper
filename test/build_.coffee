# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.build_()', ->

  it '$.build_()', ->
    await clean_()

    unless $.build_
      throw new Error()

    unless _.isFunction $.build_
      throw new Error()

    await clean_()
