$ = require '../index'
{_} = $

# return
module.exports = ->
  
  await $.compile_ './gulpfile.coffee', './temp',
    harmony: true
    map: true
    minify: false