###

  backup(source)
  recover(source)

###

$$.backup = co (source) ->

  source = _formatPath source

  for src in source

    suffix = path.extname src
    extname = '.bak'

    $.info.isSilent = true
    yield $$.copy src, null, {suffix, extname}
    $.info.isSilent = false

  $.info 'backup', "backed up '#{source}'"

$$.recover = co (source) ->

  source = _formatPath source

  for src in source

    bak = "#{src}.bak"
    if !fs.existsSync bak then continue

    basename = path.basename src

    $.info.isSilent = true
    yield $$.remove src
    yield $$.copy bak, null, basename
    yield $$.remove bak
    $.info.isSilent = false

  $.info 'recover', "recovered '#{source}'"