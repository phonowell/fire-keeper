# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.shell_(cmd, [option])', ->

  it '$.shell_()', ->
    await clean_()

    unless _.isFunction $.shell_
      throw new Error()

    await clean_()