# require
$ = require 'node-jquery-extend'
_ = $._

Promise = require 'bluebird'
co = Promise.coroutine

# install
do ->
  list = [
    'gulp-util'
    'gulp-watch'
    'gulp-plumber'
    'gulp-plumber'
    'gulp-rename'
    'gulp-include'
    'gulp-replace'
    'gulp-using'
    'gulp-jade'
    'gulp-coffee'
    'gulp-stylus'
    'gulp-yaml'
    'gulp-uglify'
    'gulp-clean-css'
    'gulp-coffeelint'
    'gulp-livereload'
  ]

  $.shell "cnpm i --save #{list.join ' '}"

return

# uninstall
do ->
  p = require './package.json'

  list = (key for key of p.dependencies)
  $.shell "cnpm uninstall --save #{list.join ' '}"