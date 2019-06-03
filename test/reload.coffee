# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.reload(source)', ->

  it '$.reload()', ->
    await clean_()

    unless $.reload
      throw new Error()

    unless _.isFunction $.reload
      throw new Error()

    await clean_()
