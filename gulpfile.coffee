$ = try require 'fire-keeper'
catch then require './index'

fs = require 'fs'

# task
for filename in fs.readdirSync './task'
  do (filename) ->

    unless filename.includes '.coffee'
      return

    name = filename.replace /\.coffee/, ''
    $.task name, (arg...) ->
      fn_ = require "./task/#{name}.coffee"
      await fn_ arg...