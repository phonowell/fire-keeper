$ = require '../index'
{_} = $

# return
module.exports = ->

  msg = '月下美人'
  listLang = [
    'ja'
    'zh'
    'zh-hk'
    'zh-tw'
  ]
  for lang in listLang
    await $.say_ msg, {lang}