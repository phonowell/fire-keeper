# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.task(source)', ->

  it '$.task()', ->
    await clean_()

    if !$.task
      throw new Error()

    unless _.isFunction $.task
      throw new Error()

    await clean_()