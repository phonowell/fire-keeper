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

  it 'for windows', ->

    source = 'C:\\Users\\mimiko\\Project\\fire-keeper\\readme.md'
    {basename, dirname, extname, filename} = $.getName source

    unless basename == 'readme'
      throw new Error basename

    unless dirname == 'C:/Users/mimiko/Project/fire-keeper'
      throw new Error dirname

    unless extname == '.md'
      throw new Error extname

    unless filename == 'readme.md'
      throw new Error filename
