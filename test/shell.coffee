# require

$ = require './../index'
{_} = $.library

# variable

temp = './temp'

# function

clean = -> await $.remove temp

# test

describe '$.shell(cmd, [option])', ->

  it '$.shell()', ->
    await clean()

    unless _.isFunction $.shell
      throw new Error()

    await clean()