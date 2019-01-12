$ = require '../index'
{_} = $

# return
module.exports = ->

  try
    # your lines here
    a.b = 1
  catch e
    keyword = (e.message or e.name or e.toString())
    .replace /\s+/g, '+'
    await $.exec_ "open https://stackoverflow.com/search?q=#{keyword}"