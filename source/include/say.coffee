###
say(text)
###

$$.say = (text) ->

  if $$.os != 'macos' then return

  listMessage = switch $.type text
    when 'array' then text
    when 'string' then [text]
    else throw makeError 'type'

  for msg in listMessage

    $.info 'say', msg

    msg = msg
    .replace /[#\(\)-]/g, ''

    msg = _.trim msg

    if !msg.length then continue

    $.info.pause '$$.say'
    await $$.shell "say #{msg}"
    $.info.resume '$$.say'

  text # return