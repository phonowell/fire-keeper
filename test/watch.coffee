# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.watch()', ->

  it '$.watch()', ->
    await clean_()

    if $.watch != $.plugin['gulp-watch']
      throw new Error()

    unless _.isFunction $.watch
      throw new Error()

    await clean_()