_ = require 'lodash'
$ = require '../index'

class M

  ###
  checkRequire_()
  execute_()
  ###

  checkRequire_: ->

    listKey = _.keys (await $.read_ './package.json').dependencies
    listSource = await $.source_ './source/**/*.coffee'
    listCont = (await $.read_ source for source in listSource)
    listResult = []

    for key in listKey

      isUsed = false

      for cont in listCont

        reg = new RegExp "require[\\s\\(]'#{key}"

        unless ~cont.search reg
          continue
        
        isUsed = true
        break

      unless isUsed
        listResult.push key

    unless listResult.length
      $.info 'everything is ok'
      return

    for item in listResult
      $.info "'#{item}' not found"

  execute_: ->

    await $.chain @
    .checkRequire_()

    @ # return

module.exports = ->
  m = new M()
  await m.execute_()