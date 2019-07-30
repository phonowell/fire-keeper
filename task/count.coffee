$ = require '../index'

class M

  ###
  check_()
  execute_()
  makeEnd(cont)
  makeFunction_(cont)
  makeTask_(cont)
  ###

  check_: ->

    for source in await $.source_ './source/module/*.coffee'

      basename = $.getBasename source
      target = "./doc/#{basename}.md"

      isExisted = await $.isExisted_ target
      unless isExisted

        cont = [
          "# $.#{basename}()"
          ''
          '暂未就绪。'
          ''
        ].join '\n'

        await $.write_ target, cont

  execute_: ->

    await @check_()

    cont = [
      '# 目录'
      ''
    ]

    cont = await @makeFunction_ cont
    cont = await @makeTask_ cont
    cont = @makeEnd cont

    await $.write_ './doc/index.md'
    , cont.join '\n'

    @ # return

  makeEnd: (cont) ->

    date = new Date()
    string = [
      date.getFullYear()
      1 + date.getMonth()
      date.getDate()
    ].join '/'

    cont = [
      cont...
      "**最后更新于`#{string}`。**"
      ''
    ]

    cont # return

  makeFunction_: (cont) ->

    cont = [
      cont...
      '## 方法'
      ''
    ]
    
    listSource = await $.source_ './source/module/*.coffee'

    cont = [
      cont...
      "共计#{listSource.length}个方法。"
      ''
    ]

    listSource.sort()
    for source in listSource
    
      name = $.getBasename source

      cont = [
        cont...
        "- #{name}:
        [文档](../doc/#{name}.md)
        /
        [源码](../source/module/#{name}.coffee)
        /
        [测试](../test/#{name}.coffee)"
      ]

    cont.push ''
    cont # return

  makeTask_: (cont) ->

    cont = [
      cont...
      '## 任务'
      ''
    ]
    
    listSource = await $.source_ './source/task/*.coffee'

    cont = [
      cont...
      "共计#{listSource.length}个任务。"
      ''
    ]

    listSource.sort()
    for source in listSource
    
      name = $.getBasename source

      cont = [
        cont...
        "- #{name}:
        [源码](../source/task/#{name}.coffee)"
      ]

    cont.push ''
    cont # return

module.exports = ->
  m = new M()
  await m.execute_()