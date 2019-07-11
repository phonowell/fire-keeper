$ = require '../index'
coffee = require 'coffeescript'

class M

  ###
  check_()
  clean_()
  compile_()
  exec_()
  execute_()
  ###

  check_: ->
    listSource = await $.source_ './source/module/*.coffee'
    for source in listSource
      basename = $.getBasename source
      target = "./test/#{basename}.coffee"
      unless await $.isExisted_ target
        throw new Error "'#{target}' not found"
    @ # return

  clean_: ->
    await $.remove_ './test/*.js'
    @ # return

  compile_: ->

    {target} = $.argv()
    target or= '*'
    
    listSource = await $.source_ "./test/#{target}.coffee"
    for source in listSource

      target = source
      .replace /\.coffee/, '.js'
      cont = await $.read_ source

      cont = (
        "  #{line}" for line in cont.split '\n' when line.trim().length
      ).join '\n'

      cont = cont
      .replace /throw/g, 'throw new Error'

      cont = [
        # import
        "$ = require '../index'"
        "_ = require 'lodash'"
        # variable
        "temp = './temp'"
        # function
        'clean_ = -> await $.remove_ temp'
        # default describe
        "describe '#{$.getBasename source}', ->"
        cont
      ].join '\n'

      cont = coffee.compile cont,
        bare: true

      await $.write_ target, cont

    @ # return

  exec_: ->
    await $.exec_ 'npm test'
    @ # return

  execute_: ->

    await $.chain @
    .check_()
    .clean_()
    .compile_()
    .exec_()
    .clean_()

    @ # return

# return
module.exports = ->
  m = new M()
  await m.execute_()
  await $.say_ 'mission completed'