# gulp = require 'gulp'
# include = require 'gulp-include'
# coffee = require 'gulp-coffee'

# return gulp.task 'default', ->
#   gulp.src './source/index.coffee'
#   .pipe include()
#   .pipe coffee()
#   .pipe gulp.dest './'

# require
$ = require './index'
fs = require 'fs'
path = require 'path'

# task
listFilename = fs.readdirSync './task'
for filename in listFilename

  unless ~filename.search /\.coffee/
    continue

  name = filename.replace /\.coffee/, ''

  do (name) -> $.task name, ->
    fn = require "./task/#{name}.coffee"
    fn()