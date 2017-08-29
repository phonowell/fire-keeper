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
{$, _, Promise} = $$.library
co = Promise.coroutine

# task

###

  build
  compile
  lint
  set
  test
  watch
  work

###

$$.task 'build', co ->
  yield $$.compile './source/index.coffee', minify: false
  yield $$.copy './source/index.js', './'

$$.task 'compile', -> compile()

$$.task 'lint', co ->

  yield $$.task('kokoro')()

  yield $$.lint [
    './gulpfile.coffee'
    './source/**/*.coffee'
    './test/**/*.coffee'
  ]

$$.task 'set', co ->

  if !(ver = $$.argv.version) then return

  yield $$.replace './package.json'
  , /"version": "[\d.]+"/, "\"version\": \"#{ver}\""

$$.task 'test', co ->

  yield $$.compile './test/**/*.coffee'
  yield $$.shell 'npm test'
  yield $$.remove './test/**/*.js'

$$.task 'watch', ->

  deb = _.debounce $$.task('build'), 1e3

  $$.watch [
    './source/index.coffee'
    './source/include/*.coffee'
  ], deb

$$.task 'work', -> $$.shell 'start gulp watch'

#$$.task 'z', co ->
