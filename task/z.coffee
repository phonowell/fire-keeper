$ = require '../index'
{_} = $

# return
module.exports = ->

  listSource = await $.source_ [
    './temp/**/*.styl'
  ]

  await $.lint_ listSource