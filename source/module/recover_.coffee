export default (source) ->

  msg = "recovered #{$.wrapList source}"

  for source in $.normalizePathToArray source

    pathBak = "#{source}.bak"
    unless await $.isExisted_ pathBak
      $.info 'recover', "'#{pathBak}' not found"
      continue

    filename = $.getFilename source

    await $.info().silence_ ->
      await $.remove_ source
      await $.copy_ pathBak, null, filename
      await $.remove_ pathBak

  $.info 'recover', msg

  @ # return