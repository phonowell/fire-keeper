# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$._watch()', ->

  it '$._watch()', ->
    await clean_()

    unless $._watch
      throw new Error()

    unless _.isFunction $._watch
      throw new Error()

    await clean_()
