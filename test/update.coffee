# require

$ = require './../index'
{_} = $.library

# variable

temp = './temp'

# function

clean = -> await $.remove temp

# test

describe '$.update()', ->

  it '$.update()', ->
    await clean()

    if !$.update
      throw new Error()

    unless _.isFunction $.update
      throw new Error()

    await clean()