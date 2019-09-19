class M

  constructor: (option) ->

    ###
    data
      compile
        extend
        extname
      copy
        extend
        extname
      option
      path
        source
        target
    ###
    
    data =
      compile:
        extend: [
          '!**/include/**'
          '!**/*.min.*'
        ]
        extname: [
          '.coffee'
          '.css'
          '.html'
          '.js'
          '.md'
          '.pug'
          '.styl'
          # '.ts'
          '.yaml'
        ]
      copy:
        extend: [
          '!**/include/**'
        ]
        extname: [
          '.css'
          '.gif'
          '.html'
          '.jpg'
          '.js'
          '.json'
          '.png'
          '.ttf'
          '.txt'
          '.vue'
          '.xml'
        ]
      option: {}
      path:
        source: './source'
        target: './dist'

    @data = _.merge data, option

    @ # return

  ###
  bind()
  compile_()
  copy_()
  execute()
  get(key)
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

    @ # return

  get: (key) -> _.get @data, key

  watchCompile: ->

    listExt = @get 'compile.extname'
    pathSource = @get 'path.source'
    pathBuild = @get 'path.build'

    listSource = [
      ("#{pathSource}/**/*#{ext}" for ext in listExt)...
      (@get 'compile.extend')...
    ]
    $.watch listSource, (e) =>
      await @compile_ e.path, @data.option

    @ # return

  watchCopy: ->

    listExt = @get 'copy.extname'
    pathSource = @get 'path.source'
    pathBuild = @get 'path.build'

    listSource = [
      ("#{pathSource}/**/*#{ext}" for ext in listExt)...
      (@get 'copy.extend')...
    ]
    $.watch listSource, (e) =>
      await @copy_ e.path

    @ # return

export default (option = {}) ->
  m = new M option
  m.execute()
  @ # return