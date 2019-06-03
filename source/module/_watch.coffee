# path = require 'path'

class M

  constructor: (option) ->
    
    data =
      list:
        copy: [
          '.css'
          '.gif'
          '.html'
          '.jpg'
          '.js'
          '.json'
          '.png'
          '.ttf'
          '.txt'
          '.xml'
        ]
        compile: [
          '.coffee'
          '.css'
          '.html'
          '.js'
          '.md'
          '.pug'
          '.styl'
          '.ts'
          '.yaml'
        ]
      path:
        source: './source'
        target: './dist'

    @option = _.merge data, option

    @ # return

  ###
  bind()
  compile_()
  copy_()
  execute()
  get(key)
  reloadCss()
  watchCompile()
  watchCopy()
  ###

  bind: ->
    process.on 'uncaughtException', (e) ->
      $.i e.stack
    @ # return

  compile_: (source, option = {}) ->

    stringSource = $.getBasename @get 'path.source'
    stringTarget = $.getBasename @get 'path.target'

    reg = new RegExp stringSource

    target = $.getDirname source
    .replace reg, stringTarget
    .replace /\/{2,}/g, '/'

    option.map ?= true
    option.minify ?= false

    await $.compile_ source, target, option

    @ # return

  copy_: (source) ->

    stringSource = $.getBasename @get 'path.source'
    stringTarget = $.getBasename @get 'path.target'

    reg = new RegExp stringSource

    target = $.getDirname source
    .replace reg, stringTarget
    .replace /\/{2,}/g, '/'

    await $.copy_ source, target

    @ # return

  execute: ->

    @
    .bind()
    .watchCompile()
    .watchCopy()
    .reloadCss()

    @ # return

  get: (key) -> _.get @option, key

  reloadCss: ->
    pathTarget = @get 'path.target'
    $.reload "#{pathTarget}/**/*.css"
    @ # return

  watchCompile: ->

    listExt = @get 'list.compile'
    pathSource = @get 'path.source'
    pathBuild = @get 'path.build'

    listSource = [
      ("#{pathSource}/**/*#{ext}" for ext in listExt)...
      '!**/include/**'
      '!**/*.min.*'
    ]
    $.watch listSource, (e) =>
      await @compile_ e.path

    @ # return

  watchCopy: ->

    listExt = @get 'list.copy'
    pathSource = @get 'path.source'
    pathBuild = @get 'path.build'

    listSource = [
      ("#{pathSource}/**/*#{ext}" for ext in listExt)...
      '!**/include/**'
    ]
    $.watch listSource, (e) =>
      await @copy_ e.path

    @ # return

# return
$._watch = (option = {}) ->
  m = new M option
  m.execute()
  $ # return
