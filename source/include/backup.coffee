###
backup_(source)
recover_(source)
###

$.backup_ = (source) ->

  listSource = await $.source_ source

  msg = "backed up #{wrapList source}"

  for source in listSource
    suffix = $.getExtname source
    extname = '.bak'

    $.info.pause '$.backup_'
    await $.copy_ source, null, {suffix, extname}
    $.info.resume '$.backup_'

  $.info 'backup', msg

  $ # return

$.recover_ = (source) ->

  groupSource = normalizePathToArray source

  msg = "recovered #{wrapList source}"

  for source in groupSource

    pathBak = "#{source}.bak"
    unless await $.isExisted_ pathBak
      $.i "'#{pathBak}' not found"
      continue

    filename = $.getFilename source

    $.info.pause '$.recover_'
    await $.chain $
    .remove_ source
    .copy_ pathBak, null, filename
    .remove_ pathBak
    $.info.resume '$.recover_'

  $.info 'recover', msg

  $ # return