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
          # '.ts'
          '.yaml'
        ]
      path:
        source: './source'
        target: './build'

    @option = _.merge data, option

    @ # return

  ###
  clean_()
  compile_()
  copy_()
  execute_()
  get(key)
  ###

  clean_: ->
    await $.remove_ @get 'path.target'
    @ # return

  compile_: ->

    listExt = @get 'list.compile'
    pathSource = @get 'path.source'
    pathTarget = @get 'path.target'

    listSource = [
      ("#{pathSource}/**/*#{ext}" for ext in listExt)...
      '!**/include/**'
      '!**/*.min.*'
    ]
    await $.compile_ listSource, pathTarget,
      base: pathSource

    @ # return

  copy_: ->

    listExt = @get 'list.copy'
    pathSource = @get 'path.source'
    pathTarget = @get 'path.target'

    listSource = [
      ("#{pathSource}/**/*#{ext}" for ext in listExt)...
      '!**/include/**'
    ]
    await $.copy_ listSource, pathTarget

    @ # return

  execute_: ->
    
    await $.chain @
    .clean_()
    .copy_()
    .compile_()
    
    @ # return

  get: (key) -> _.get @option, key

# return
$.target_ = (option = {}) ->
  m = new M option
  await m.execute_()
  $ # return
  