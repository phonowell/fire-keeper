$ = require '../index'
{_} = $

# return
module.exports = ->

  await $.lint_ [
    './*.coffee'
    './*.md'
    './source/**/*.coffee'
    './task/**/*.coffee'
    './test/**/*.coffee'
  ]