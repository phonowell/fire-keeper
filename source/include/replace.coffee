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

  $.info.pause '$$.replace'

  for src in listSource
    
    cont = $.parseString await $$.read src

    res = if callback
      $.parseString callback cont
    else cont.replace reg, replacement

    if res == cont
      continue

    await $$.write src, res

  $.info.resume '$$.replace'

  msg = if callback
    'replaced with function'
  else "replaced '#{reg}' to '#{replacement}'"
  msg += ", in #{wrapList source}"

  $.info 'replace', msg

  $$ # return