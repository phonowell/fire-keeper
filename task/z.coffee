$ = require '../index'
{_} = $

# return
module.exports = ->

  $.i await $.prompt
    type: 'autocomplete'
    choices: []