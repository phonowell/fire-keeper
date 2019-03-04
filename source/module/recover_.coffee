# return
$.recover_ = (source) ->

  groupSource = normalizePathToArray source

  msg = "recovered #{wrapList source}"

  for source in groupSource

    pathBak = "#{source}.bak"
    unless await $.isExisted_ pathBak
      $.info 'recover', "'#{pathBak}' not found"
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