coffee = require 'coffeescript'

$ = require '../index'
lazy_ = require '../toolkit/lazy_'
pre = require '../toolkit/pre'

module.exports = ->

  # module
  for source in await $.source_ './source/module/*.coffee'
    basename = $.getBasename source
    cont = await $.read_ source
    cont = pre cont, '../dist'
    cont = coffee.compile cont,
      bare: true
    await $.write_ "./dist/#{basename}.js", cont

  # task
  for source in await $.source_ './source/task/*.coffee'
    basename = $.getBasename source
    cont = await $.read_ source
    cont = pre cont, '../../dist'
    cont = coffee.compile cont,
      bare: true
    await $.write_ "./dist/task/#{basename}.js", cont

  # index
  await $.compile_ './source/index.coffee', './',
    bare: true
    minify: false
  await lazy_()