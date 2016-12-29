# require
$ = require 'node-jquery-extend'
_ = $._

Promise = require 'bluebird'
co = Promise.coroutine

gulp = require 'gulp'

$$ = require './source/index'
$$.use gulp

#build
gulp.task 'build', co ->
  yield $$.delete [
    './index.js'
    './source/index.js'
  ]
  yield $$.compile './source/index.coffee'
  yield $$.copy './source/index.js'

# lint
gulp.task 'lint', co -> yield $$.lint 'coffee'

# prepare
gulp.task 'prepare', co ->
  yield $$.compile './gulpfile.coffee'
  yield $$.compile './coffeelint.yml'

# noop
gulp.task 'noop', -> null