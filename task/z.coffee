$ = require '../index'
{_} = $

# return
module.exports = ->

  await $.remove_ './temp'
  await $.compile_ './readme.md', './temp'
  $.i await $.isExisted_ './temp/readme.html'