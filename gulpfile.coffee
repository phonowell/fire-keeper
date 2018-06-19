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

$ = require './index'
{_} = $.library

# task

###
build()
compile()
lint()
set(ver)
test()
###

$.task 'build', ->

  await $.compile_ './source/index.coffee', './',
    minify: false

$.task 'compile', -> compile()

$.task 'lint', ->

  await $.task('kokoro')()

  await $.lint_ [
    './*.md'
    './source/**/*.md'
  ]

  await $.lint_ [
    './gulpfile.coffee'
    './source/**/*.coffee'
    './test/**/*.coffee'
  ]

$.task 'set', ->

  {ver} = $.argv

  if !ver
    throw new Error 'empty ver'

  await $.replace_ './package.json', (cont) ->
    data = $.parseJson cont
    data.version = ver
    data

$.task 'test', ->

  {target} = $.argv
  target or= '**/*'
  source = "./test/#{target}.coffee"

  # function

  clean_ = ->
    await $.remove_ [
      './test/**/*.js'
      './test/**/*.map'
    ]

  # execute

  await clean_()

  await $.compile_ source,
    map: true
    minify: false
  
  unless await $.shell_ 'npm test'
    throw new Error()
  
  await clean_()

  await $.say_ 'mission completed'

$.task 'y', ->

  listSource = await $.source_ './test/*.coffee'

  for source in listSource

    await $.replace_ source
    , /# function\n/g
    , '# function'

$.task 'z', ->

  listSource = await $.source_ [
    './gulpfile.coffee'
    './source/**/*.coffee'
    './test/**/*.coffee'
  ]

  for source in listSource

    await $.replace_ source, /\$\.([^\s\(]+)Async/g, (s, string) ->
      
      listKey = [
        'backup'
        'compile'
        'copy'
        'delay'
        'download'
        'isExisted'
        'isSame'
        'link'
        'lint'
        'mkdir'
        'move'
        'read'
        'recover'
        'remove'
        'rename'
        'replace'
        'say'
        'shell'
        'source'
        'ssh.connect'
        'ssh.disconnect'
        'ssh.mkdir'
        'ssh.remove'
        'ssh.shell'
        'ssh.upload'
        'stat'
        'unzip'
        'update'
        'walk'
        'write'
        'zip'
      ]

      unless string in listKey
        return s

      "$.#{_.trim string, '_'}_"