$ = require '../index'
{_} = $

# return
module.exports = ->

  # await $.task('kokoro')()

  await $.lint_ [
    './*.md'
    './doc/**/*.md'
    './gulpfile.coffee'
    './source/**/*.coffee'
    './task/**/*.coffee'
    './test/**/*.coffee'
  ]