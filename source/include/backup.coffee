###
backup_(source)
recover_(source)
###

$.backup_ = (source) ->

  source = await $.source_ source

  for src in source

    suffix = path.extname src
    extname = '.bak'

    $.info.pause '$.backup_'
    await $.copy_ src, null, {suffix, extname}
    $.info.resume '$.backup_'

  $.info 'backup', "backed up #{wrapList source}"

  $ # return

$.recover_ = (source) ->

  source = normalizePathToArray source

  for src in source

    bak = "#{src}.bak"
    unless await $.isExisted_ bak then continue

    basename = path.basename src

    $.info.pause '$.recover_'
    await $.remove_ src
    await $.copy_ bak, null, basename
    await $.remove_ bak
    $.info.resume '$.recover_'

  $.info 'recover', "recovered #{wrapList source}"

  $ # return