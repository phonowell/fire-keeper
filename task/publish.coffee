$ = require '../index'
{_} = $

# return
module.exports = ->

  await $.exec_ [
    'nrm use npm'
    'npm publish'
    'nrm use taobao'
  ]
