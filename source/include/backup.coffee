###

  backup(source)
  recover(source)

###

$$.backup = co (source) ->

  source = yield $$.source source

  for src in source

    suffix = path.extname src
    extname = '.bak'

    $.info.pause '$$.backup'
    yield $$.copy src, null, {suffix, extname}
    $.info.resume '$$.backup'

  $.info 'backup', "backed up #{wrapList source}"

  # return
  $$

$$.recover = co (source) ->

  source = formatPath source

  for src in source

    bak = "#{src}.bak"
    unless yield $$.isExisted bak then continue

    basename = path.basename src

    $.info.pause '$$.recover'
    yield $$.remove src
    yield $$.copy bak, null, basename
    yield $$.remove bak
    $.info.resume '$$.recover'

  $.info 'recover', "recovered #{wrapList source}"

  # return
  $$