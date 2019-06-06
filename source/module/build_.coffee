# path = require 'path'

class M

  constructor: (option) ->
    
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
        target: './build'

    @data = _.merge data, option

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

    listExt = @get 'compile.extname'
    pathSource = @get 'path.source'
    pathTarget = @get 'path.target'

    listSource = [
      ("#{pathSource}/**/*#{ext}" for ext in listExt)...
      (@get 'compile.extend')...
    ]
    option = _.clone @data.option
    option.base = pathSource
    await $.compile_ listSource, pathTarget, option

    @ # return

  copy_: ->

    listExt = @get 'copy.extname'
    pathSource = @get 'path.source'
    pathTarget = @get 'path.target'

    listSource = [
      ("#{pathSource}/**/*#{ext}" for ext in listExt)...
      (@get 'copy.extend')...
    ]
    await $.copy_ listSource, pathTarget

    @ # return

  execute_: ->
    
    await $.chain @
    .clean_()
    .copy_()
    .compile_()
    
    @ # return

  get: (key) -> _.get @data, key

# return
$.target_ = (option = {}) ->
  m = new M option
  await m.execute_()
  $ # return
  