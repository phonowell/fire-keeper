# require

$ = require './../index'
{_} = $.library

# variable

temp = './temp'

# function

clean = -> await $.remove temp

# test

describe '$.lint(source)', ->

  it '$.lint()', ->
    await clean()

    if !$.lint
      throw new Error()

    unless _.isFunction $.lint
      throw new Error()

    await clean()