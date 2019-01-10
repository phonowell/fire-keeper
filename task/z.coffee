$ = require '../index'
{_} = $

# return
module.exports = ->

  fn_ = $.task 'default'
  await fn_()
  $.i 'wow'