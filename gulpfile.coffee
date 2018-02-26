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

  # function

  clean = ->
    await $$.remove [
      './test/**/*.js'
      './test/**/*.map'
    ]

  # execute

  await clean()

  await $$.compile source,
    map: true
    minify: false
  
  for i in [1..5]
    $.info 'test', "round '#{i}'"
    unless await $$.shell 'npm test'
      throw new Error()
  
  await clean()

  await $$.say 'mission completed'

# $$.task 'x', -> throw new Error()
# $$.task 'y', -> $.i 'Y'

# $$.task 'z', ->

#   res = await $$.shell [
#     'gulp x'
#     'gulp y'
#   ], ignoreError: true

#   $.info res