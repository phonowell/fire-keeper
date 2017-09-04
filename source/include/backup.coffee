###

  backup(source)
  recover(source)

###

$$.backup = co (source) ->

  source = _formatPath source

  for src in source

    suffix = path.extname src
    extname = '.bak'

    $.info.pause '$$.backup'
    yield $$.copy src, null, {suffix, extname}
    $.info.resume '$$.backup'

  $.info 'backup', "backed up #{_wrapList source}"

  # return
  $$

$$.recover = co (source) ->

  source = _formatPath source

  for src in source

    bak = "#{src}.bak"
    if !fs.existsSync bak then continue

    basename = path.basename src

    $.info.pause '$$.recover'
    yield $$.remove src
    yield $$.copy bak, null, basename
    yield $$.remove bak
    $.info.resume '$$.recover'

  $.info 'recover', "recovered #{_wrapList source}"

  # return
  $$
