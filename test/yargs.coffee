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

    if $.yargs != $.plugin.yargs
      throw new Error()

    unless _.isFunction $.yargs
      throw new Error()

    await clean_()