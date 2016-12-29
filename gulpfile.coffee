# require
$ = require 'node-jquery-extend'
_ = $._

Promise = require 'bluebird'
co = Promise.coroutine

gulp = require 'gulp'

$$ = require './source/index'
$$.use gulp

# task

gulp.task 'build', co ->
  yield $$.delete [
    './index.js'
    './source/index.js'
  ]
  yield $$.compile './source/index.coffee'
  yield $$.copy './source/index.js'

gulp.task 'lint', co -> yield $$.lint 'coffee'

gulp.task 'prepare', co ->
  yield $$.compile './gulpfile.coffee'
  yield $$.compile './coffeelint.yml'

gulp.task 'set', co ->

  if !(ver = $$.argv.version) then return

  yield $$.replace './package.json'
  , /"version": "[\d.]+"/, "\"version\": \"#{ver}\""

gulp.task 'noop', -> null