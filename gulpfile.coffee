# compile

compile = ->

  gulp = require 'gulp'
  include = require 'gulp-include'
  coffee = require 'gulp-coffee'

  gulp.src './source/index.coffee'
  .pipe include()
  .pipe coffee()
  .pipe gulp.dest ''

# return (require 'gulp').task 'default', -> compile()

# require

$$ = require './index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# task

###

  build()
  compile()
  lint()
  set(ver)
  test()

###

$$.task 'build', co ->

  yield $$.compile './source/index.coffee', './',
    minify: false

$$.task 'compile', -> compile()

$$.task 'lint', co ->

  yield $$.task('kokoro')()

  yield $$.lint [
    './*.md'
    './source/**/*.md'
  ]

  yield $$.lint [
    './gulpfile.coffee'
    './source/**/*.coffee'
    './test/**/*.coffee'
  ]

$$.task 'set', co ->

  {ver} = $$.argv

  if !ver
    throw new Error 'empty ver'

  yield $$.replace './package.json'
  , /"version": "[\d.]+"/, "\"version\": \"#{ver}\""

$$.task 'test', co ->

  {target} = $$.argv
  target or= '**/*'
  source = "./test/#{target}.coffee"

  #

  clean = co ->
    yield $$.remove [
      './test/**/*.js'
      './test/**/*.map'
    ]

  #

  yield clean()

  yield $$.compile source,
    map: true
    minify: false
  
  if yield $$.shell 'npm test'
    yield clean()

$$.task 'z', co ->

  yield $$.write './temp/a.txt', '123123'

  yield $$.rename './temp/a.txt',
    extname: '.md'