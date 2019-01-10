$ = require '../index'
{_} = $

# return
module.exports = ->

  fn_ = $.task 'y'

  $.i 'start'
  await fn_()
  $.i 'end'