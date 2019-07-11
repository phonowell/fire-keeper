$ = require '../index'

module.exports = ->

  listSource = await $.source_ [
    './*.coffee'
    './data/**/*.yaml'
    './source/**/*.coffee'
    './task/**/*.coffee'
    './test/**/*.coffee'
  ]

  for source in listSource
    cont = $.parseString await $.read_ source

    cont = cont.split '\n'

    line = cont[cont.length - 1]
    unless line.trim().length
      cont.pop()
      await $.write_ source, cont.join '\n'