$ = require '../index'
{_} = $

# return
module.exports = ->

  await $.task('_build')()

  $._watch()
