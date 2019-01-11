$ = require '../index'
{_} = $

# return
module.exports = ->

  # return await $.compile_ './temp/main.coffee'

  content = [
    '#=include a.coffee'
    '#=include b.coffee'
  ].join '\n'

  await $.chain $
  .write_ './temp/main.coffee', content
  .write_ './temp/a.coffee', 'console.log 1'
  .write_ './temp/b.coffee', 'console.log 2'
  .compile_ './temp/main.coffee',
    harmony: false
    map: true