###
replace(source, option...)
###

$$.replace = (source, option...) ->

  if !source
    throw makeError 'source'

  listSource = await $$.source source

  switch option.length
    when 1 then callback = option[0]
    when 2 then [reg, replacement] = option
    else throw makeError 'length'

  msg = if callback
    'replaced with function'
  else "replaced '#{reg}' to '#{replacement}'"

  for src in listSource

    $.info.pause '$$.replace'
    
    cont = $.parseString await $$.read src

    res = if callback
      $.parseString callback cont
    else cont.replace reg, replacement

    if res == cont then continue

    await $$.write src, res

    $.info.resume '$$.replace'
    $.info 'replace', "#{msg}, in '#{src}'"

  $$ # return