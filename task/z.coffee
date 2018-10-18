$ = require '../index'
{_} = $

# return
module.exports = ->

  globby = require 'globby'

  source = [
    './source/**/*.coffee'
    '!**/include/**'
  ]

  $.i await globby source