# require

$ = require './../index'
{_} = $.library

# variable

temp = './temp'

# function

clean = -> await $.remove temp

# test

describe '$.task(source)', ->

  it '$.task()', ->
    await clean()

    if !$.task
      throw new Error()

    unless _.isFunction $.task
      throw new Error()

    await clean()