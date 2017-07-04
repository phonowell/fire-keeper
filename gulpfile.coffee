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

$$ = require './source/index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# task

###

  build
  compile
  lint
  prepare
  set
  test
  update
  watch
  work

###

$$.task 'build', co ->
  yield $$.compile './source/index.coffee', minify: false
  yield $$.copy './source/index.js', './'

$$.task 'compile', -> compile()

$$.task 'lint', co ->

  yield $$.task('prepare')()

  yield $$.lint [
    './gulpfile.coffee'
    './source/**/*.coffee'
  ]

$$.task 'prepare', co ->

  # copy

  LIST = [
    '.gitignore'
    '.npmignore'
    'coffeelint.yml'
    'stylintrc.yml'
  ]

  for source in LIST

    yield $$.remove "./#{source}"
    yield $$.copy "./../kokoro/#{source}", './'
    yield $$.shell "git add -f ./#{source}"

  # compile

  yield $$.compile './coffeelint.yml'

  yield $$.compile './stylintrc.yml'
  yield $$.copy './stylintrc.json', './',
    prefix: '.'
    extname: ''
  yield $$.remove './stylintrc.json'

$$.task 'set', co ->

  if !(ver = $$.argv.version) then return

  yield $$.replace './package.json'
  , /"version": "[\d.]+"/, "\"version\": \"#{ver}\""

$$.task 'test', co ->
  yield $$.compile './test.coffee'
  yield $$.shell 'node test'
  yield $$.remove './test.js'

$$.task 'update', co ->

  pkg = './package.json'
  yield $$.backup pkg

  p = require pkg
  list = []

  for key of p.devDependencies
    list.push "cnpm r --save-dev #{key}"
    list.push "cnpm i --save-dev #{key}"

  for key of p.dependencies
    list.push "cnpm r --save #{key}"
    list.push "cnpm i --save #{key}"

  yield $$.shell list

  yield $$.remove "#{pkg}.bak"

$$.task 'watch', ->

  deb = _.debounce $$.task('build'), 1e3

  $$.watch [
    './source/index.coffee'
    './source/include/*.coffee'
  ], deb

$$.task 'work', -> $$.shell 'start gulp watch'