$ = require '../index'

# return
module.exports = ->

  # original build
  await $.task('build')()

  # test
  await $.task('test')()