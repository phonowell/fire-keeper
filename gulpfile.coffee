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
  yield $$.build
    coffee: null

# lint
gulp.task 'lint', co -> yield $$.lint 'coffee'

# prepare
gulp.task 'prepare', co ->
  yield $$.compile 'gulpfile'
  yield $$.compile 'coffeelint'

# noop
gulp.task 'noop', -> null