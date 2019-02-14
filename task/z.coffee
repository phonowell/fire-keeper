$ = require '../index'
{_} = $

# return
module.exports = ->

  list = ['a', 'b', 'c']

  value = await $.prompt
    id: 'select'
    type: 'select'
    list: list

  $.i value
  $.i list