# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.update_()', ->

  it '$.update_()', ->
    await clean_()

    unless $.update_
      throw new Error()

    unless _.isFunction $.update_
      throw new Error()

    await clean_()