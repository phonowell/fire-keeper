$ = require '../index'
{_} = $

# return
module.exports = ->

  await $.chain $
  .write_ './temp/text.yaml', '- a: 1'
  .compile_ './temp/text.yaml',
    map: true