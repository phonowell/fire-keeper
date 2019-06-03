# return
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
