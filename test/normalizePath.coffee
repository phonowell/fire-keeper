it 'default', ->

  # ./source

  source = './source'
  answer = "#{$.root()}/source"

  result = $.normalizePath source

  unless result == answer
    throw 0

  # ~/opt

  source = '~/opt'
  answer = "#{$.home()}/opt"

  result = $.normalizePath source

  unless result == answer
    throw 1

  # ./a/b/../c

  source = './a/b/../c'
  answer = "#{$.root()}/a/c"

  result = $.normalizePath source

  unless result == answer
    throw 2

  # ../a

  path = require 'path'

  source = '../a'
  answer = path.normalize "#{$.root()}/../a"

  result = $.normalizePath source

  unless result == answer
    throw 3