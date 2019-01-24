$ = require '../index'
{_} = $

# return
module.exports = ->

  return $.i $.task()

  # confirm
  await $.prompt
    id: 'confirm'
    type: 'confirm'

  # number
  await $.prompt
    id: 'number'
    type: 'number'

  # text
  await $.prompt
    id: 'text'
    type: 'text'

  # select
  await $.prompt
    id: 'select'
    type: 'select'
    list: ['a', 'b', 'c']

  # toggle
  await $.prompt
    id: 'toggle'
    type: 'toggle'