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

# task

$$.task 'work', -> $$.shell 'start gulp watch'

$$.task 'watch', ->
  deb = _.debounce $$.task('build'), 1e3
  $$.watch [
    './source/index.coffee'
    './source/include/*.coffee'
  ], deb

$$.task 'build', co ->
  yield $$.compile './source/index.coffee' , minify: false
  yield $$.copy './source/index.js', './'

$$.task 'lint', co -> yield $$.lint 'coffee'

$$.task 'prepare', co -> yield $$.compile './coffeelint.yml'

$$.task 'set', co ->

  if !(ver = $$.argv.version) then return

  yield $$.replace './package.json'
  , /"version": "[\d.]+"/, "\"version\": \"#{ver}\""

$$.task 'test', co ->
  yield $$.compile './test.coffee'
  yield $$.shell 'node test'
  yield $$.remove './test.js'

$$.task 'init', co ->

  yield $$.remove './.gitignore'
  yield $$.copy './../kokoro/.gitignore'

  yield $$.remove './.npmignore'
  yield $$.copy './../kokoro/.npmignore'

  yield $$.remove './coffeelint.yml'
  yield $$.copy './../kokoro/coffeelint.yml'

$$.task 'dev', co ->
  yield $$.compile './test.coffee'