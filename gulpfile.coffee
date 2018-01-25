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
{$, _} = $$.library

# task

###

  build()
  compile()
  lint()
  set(ver)
  test()

###

$$.task 'build', ->

  await $$.compile './source/index.coffee', './',
    minify: false

$$.task 'compile', -> compile()

$$.task 'lint', ->

  await $$.task('kokoro')()

  await $$.lint [
    './*.md'
    './source/**/*.md'
  ]

  await $$.lint [
    './gulpfile.coffee'
    './source/**/*.coffee'
    './test/**/*.coffee'
  ]

$$.task 'set', ->

  {ver} = $$.argv

  if !ver
    throw new Error 'empty ver'

  await $$.replace './package.json', (cont) ->
    data = $.parseJson cont
    data.version = ver
    data

$$.task 'test', ->

  {target} = $$.argv
  target or= '**/*'
  source = "./test/#{target}.coffee"

  #

  clean = ->
    await $$.remove [
      './test/**/*.js'
      './test/**/*.map'
    ]

  #

  await clean()

  await $$.compile source,
    map: true
    minify: false
  
  for i in [1..10]
    $.info 'test', "round '#{i}'"
    unless await $$.shell 'npm test'
      throw new Error()
  
  await clean()

# $$.task 'x', ->

#   i = 0
#   setInterval ->
#     $.info 'x', i++
#   , 200

# $$.task 'y', ->

#   i = 0
#   setInterval ->
#     $.info 'y', i--
#   , 200

# $$.task 'z', ->

#   a = $$.shell()
#   a.execute [
#     'gulp x'
#   ], ignoreError: true
#   $$.delay 5e3, -> a.close()

#   b = $$.shell()
#   b.execute [
#     'gulp y'
#   ], ignoreError: true
#   $$.delay 1e4, -> b.close()