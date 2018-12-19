###
chain(fn, option)
###

$.chain = (arg...) ->
  $.chain.fn or= require 'achain'
  $.chain.fn arg...