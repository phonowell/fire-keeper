_ = require 'lodash'
$ = require '../index'

# function

class M

  ###
  checkBlank_()
  checkRequire_()
  execute_()
  report(list = [])
  ###

  checkBlank_: ->

    $.info "# check 'blank'"

    $.info().pause()
    listSource = await $.source_ [
      './*.coffee'
      './source/**/*.coffee'
      './task/**/*.coffee'
      './test/**/*.coffee'
    ]
    listCont = (await $.read_ source for source in listSource)
    $.info().resume()

    listResult = []

    for source, i in listSource

      cont = listCont[i]

      if ~cont.search /\n{3,}/
        listResult.push "'#{source}' got too many blank lines"

      unless _.trim _.last cont.split '\n'
        listResult.push "'#{source}' got a blank line at the end"

    @report listResult

    @ # return

  checkRequire_: ->

    $.info "# check 'require'"

    $.info().pause()
    listKey = _.keys (await $.read_ './package.json').dependencies
    listSource = await $.source_ './source/**/*.coffee'
    listCont = (await $.read_ source for source in listSource)
    $.info().resume()
    
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
        listResult.push "'#{key}' not found"

    @report listResult

    @ # return

  execute_: ->

    await $.chain @
    .checkBlank_()
    .checkRequire_()

    @ # return

  report: (list = []) ->

    unless list.length
      $.info 'everything is ok'
      return @

    for item in list
      $.info item

    @ # return

# return
module.exports = ->
  m = new M()
  await m.execute_()