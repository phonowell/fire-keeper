$ = require '../index'

# return
module.exports = ->

  await $.chain $
  .copy_ './index.js', './temp'
  .compile_ './temp/index.js'