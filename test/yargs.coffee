# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.yargs()', ->

  it '$.yargs()', ->
    await clean_()

    type = $.type $.yargs
    unless type == 'function'
      throw new Error "invalid type '#{type}'"

    await clean_()
