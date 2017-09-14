# compile

compile = ->

  gulp = require 'gulp'
  include = require 'gulp-include'
  coffee = require 'gulp-coffee'

  gulp.src './source/index.coffee'
  .pipe include()
  .pipe coffee()
  .pipe gulp.dest './source/'

  gulp.src './source/index.js'
  .pipe gulp.dest ''

# require

fs = require 'fs'
source = if fs.existsSync './source/index.js'
  './source/index'
else './index'

$$ = require source
{$, Promise} = $$.library
co = Promise.coroutine

# task

###

  build
  compile
  lint
  prepare
  set
  test

###

$$.task 'build', co ->

  yield $$.compile './source/index.coffee', './',
    minify: false

$$.task 'compile', -> compile()

$$.task 'lint', co ->

  yield $$.task('kokoro')()

  yield $$.lint [
    './gulpfile.coffee'
    './source/**/*.coffee'
    './test/**/*.coffee'
  ]

$$.task 'prepare', co ->

  yield $$.compile './test/**/*.coffee'

$$.task 'set', co ->

  if !(ver = $$.argv.version) then return

  yield $$.replace './package.json'
  , /"version": "[\d.]+"/, "\"version\": \"#{ver}\""

$$.task 'test', co ->

  yield $$.compile './test/**/*.coffee'
  yield $$.shell 'npm test'
  yield $$.remove './test/**/*.js'

#$$.task 'y', ->

#$$.task 'z', co ->
