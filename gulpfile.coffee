#gulp = require 'gulp'
#include = require 'gulp-include'
#coffee = require 'gulp-coffee'
#
#gulp.task 'default', ->
#
#  gulp.src './source/index.coffee'
#  .pipe include()
#  .pipe coffee()
#  .pipe gulp.dest './source/'
#
#  gulp.src './source/index.js'
#  .pipe gulp.dest ''
#
#return

$$ = require './source/index'

{_, Promise} = $$.library

co = Promise.coroutine

# config

$$.config 'useHarmony', true

# task

$$.task 'work', co -> yield $$.shell 'gulp watch'

$$.task 'watch', ->
  deb = _.debounce $$.task('build'), 1e3
  $$.watch [
    './source/index.coffee'
    './source/include/*.coffee'
  ], deb

$$.task 'build', co ->
  yield $$.compile './source/index.coffee'
  yield $$.copy './source/index.js', './'

$$.task 'lint', co -> yield $$.lint 'coffee'

$$.task 'prepare', co ->
  yield $$.compile './gulpfile.coffee'
  yield $$.compile './coffeelint.yml'

$$.task 'set', co ->

  if !(ver = $$.argv.version) then return

  yield $$.replace './package.json'
  , /"version": "[\d.]+"/, "\"version\": \"#{ver}\""

$$.task 'test', co -> yield $$.shell 'node test'