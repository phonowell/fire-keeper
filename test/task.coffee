# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.task(source)', ->

  it '$.task', ->

    type = $.type $.task
    unless type == 'function'
      throw new Error "invalid type '#{type}'"

  it "$.task('name')", ->

    fn_ = $.task 'default'
    type = $.type fn_
    unless type == 'async function'
      throw new Error "invalid type '#{type}'"
