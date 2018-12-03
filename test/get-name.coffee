# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.getName(source)', ->

  it '$.getName(source)', ->

    source = '~/Downloads/test.txt'
    {basename, dirname, extname, filename} = $.getName source

    unless basename == 'test'
      throw new Error 1

    unless dirname == '~/Downloads'
      throw new Error 2
    
    unless extname == '.txt'
      throw new Error 3

    unless filename == 'test.txt'
      throw new Error 4