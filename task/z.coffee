$ = require '../index'
{_} = $

# return
module.exports = ->

  path = require 'path'

  src = 'C:\\Users\\mimiko\\Project\\fire-keeper\\readme.md'
  .replace /\\/g, '/'
  
  $.i path.dirname src
