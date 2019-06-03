$ = require '../index'

class M

  ###
  pathBuild
  pathTemp

  clean_()
  compileIndex_()
  compileModule_()
  execute_()
  genPre(cont, filename)
  prepare_()
  rewriteLazy_()
  ###

  pathBuild: './build'
  pathTemp: './temp'

  clean_: ->
    await $.remove_ @pathTemp
    @ # return

  compileIndex_: ->
    await $.compile_ './source/index.coffee', './',
      minify: false
    @ # return

  compileModule_: ->

    for source in @listModule

      filename = $.getFilename source

      cont = await $.read_ source
      listContent = cont.split '\n'

      for line, i in listContent
        listContent[i] = "  #{line}"

      listPre = @genPre cont, filename

      listContent = [listPre..., listContent...]
      cont = listContent.join '\n'

      pathTemp = "#{@pathTemp}/#{filename}"
      await $.write_ pathTemp, cont
      await $.compile_ pathTemp, @pathBuild,
        minify: false

    @ # return

  execute_: ->
    
    await $.chain @
    .prepare_()
    .rewriteLazy_()
    .compileModule_()
    .compileIndex_()
    .clean_()
    
    @ # return

  genPre: (cont, filename) ->

    listPre = [
      'module.exports = ($) ->'
      ''
    ]

    # lodash
    
    if ~cont.search /\_\./
      listAdd = [
        '  {_} = $'
        ''
      ]
      listPre = [listPre..., listAdd...]

    # fn

    listKey = [
      'excludeInclude'
      'formatArgument'
      'getPlugin'
      'normalizePath'
      'normalizePathToArray'
      'wrapList'
    ]

    listResult = []
    for key in listKey

      unless ~cont.search "#{key} "
        continue

      listResult.push key
    
    if listResult.length
      listAdd = [
        "  {#{listResult.join ', '}} = $.fn"
        ''
      ]
      listPre = [listPre..., listAdd...]

    # plugin

    listPlugin = [
      'fs'
      'fse'
      'gulp'
      'gulpIf'
      'kleur'
      'path'
      'using'
    ]

    for plugin in listPlugin

      reg = new RegExp "#{plugin}[\\s\\(\\.]"
      unless ~cont.search reg
        continue

      unless ~cont.search "#{plugin} = require "
        throw new Error "'#{plugin}' may not defined in '#{filename}'"

    # return
    listPre

  prepare_: ->
    
    @listModule = await $.source_ './source/module/*.coffee'
    
    # await $.remove_ @pathBuild
    
    @ # return

  rewriteLazy_: ->

    pathSource = './source/include/lazy.coffee'

    cont = await $.read_ pathSource

    stringName = (
      "'#{$.getBasename name}'" for name in @listModule
    ).join ', '
    
    cont = cont
    .replace /listKey\s=\s\[.*\]/, "listKey = [#{stringName}]"

    await $.write_ pathSource, cont

    @ # return

# return
module.exports = ->
  m = new M()
  await m.execute_()
