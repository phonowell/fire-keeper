$ = require '../index'

class M

  ###
  execute_()
  ###

  execute_: ->

    source = './index.js'

    listModule = await $.source_ './source/module/*.coffee'
    stringModule = (
      "'#{$.getBasename name}'" for name in listModule
    ).join ', '

    listTask = await $.source_ './source/task/*.coffee'
    stringTask = (
      "'#{$.getBasename name}'" for name in listTask
    ).join ','

    cont = await $.read_ source
    result = cont

    # module
    .replace /listLazyModule\s=\s\[.*\];/
    , "listLazyModule = [#{stringModule}];"

    # task
    .replace /listLazyTask\s=\s\[.*\];/
    , "listLazyTask = [#{stringTask}];"
    
    await $.write_ source, result

    @ # return

module.exports = ->
  m = new M()
  await m.execute_()