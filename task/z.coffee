$ = require '../index'

module.exports = ->
  
  string = '%s is not good'

  $.i string.replace /%s/g, 'haha'