###
replace_(source, option...)
###

$.replace_ = (source, option...) ->

  if !source
    throw new Error 'invalid source'

  listSource = await $.source_ source

  switch option.length
    when 1 then callback = option[0]
    when 2 then [reg, replacement] = option
    else throw new Error 'invalid argument length'

  msg = if callback
    'replaced with function'
  else "replaced '#{reg}' to '#{replacement}'"

  for src in listSource

    $.info.pause '$.replace_'
    
    cont = $.parseString await $.read_ src

    res = if callback
      $.parseString callback cont
    else cont.replace reg, replacement

    if res == cont then continue

    await $.write_ src, res

    $.info.resume '$.replace_'
    $.info 'replace', "#{msg}, in '#{src}'"

  $ # return