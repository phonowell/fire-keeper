###
backup(source)
recover(source)
###

$$.backup = (source) ->

  source = await $$.source source

  for src in source

    suffix = path.extname src
    extname = '.bak'

    $.info.pause '$$.backup'
    await $$.copy src, null, {suffix, extname}
    $.info.resume '$$.backup'

  $.info 'backup', "backed up #{wrapList source}"

  # return
  $$

$$.recover = (source) ->

  source = formatPath source

  for src in source

    bak = "#{src}.bak"
    unless await $$.isExisted bak then continue

    basename = path.basename src

    $.info.pause '$$.recover'
    await $$.remove src
    await $$.copy bak, null, basename
    await $$.remove bak
    $.info.resume '$$.recover'

  $.info 'recover', "recovered #{wrapList source}"

  # return
  $$