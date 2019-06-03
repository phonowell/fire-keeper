$ = require '../index'

# return
module.exports = ->

  {target} = $.argv
  target or= '**/*'
  source = "./test/#{target}.coffee"

  # function

  clean_ = ->
    await $.remove_ [
      './test/**/*.js'
      './test/**/*.map'
    ]

  # execute

  await clean_()

  await $.compile_ source,
    map: true
    minify: false

  unless await $.exec_ 'npm test'
    throw new Error()

  await clean_()

  await $.say_ 'mission completed'
