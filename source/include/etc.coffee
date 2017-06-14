###

  $$.backup(source)
  $$.delay(time)
  $$.divide()
  $$.recover(source)
  $$.reload(source)
  $$.shell(cmd)
  $$.watch()

###

$$.backup = co (source) ->

  source = _formatSource source

  for src in source

    suffix = path.extname src
    extname = '.bak'

    $.info.isSilent = true
    yield $$.copy src, null, {suffix, extname}
    $.info.isSilent = false

  $.info 'backup', "backed up '#{source}'"

$$.delay = co (time = 0) ->
  yield new Promise (resolve) ->
    $.next time, -> resolve()
  $.info 'delay', "delayed '#{time} ms'"

$$.divide = -> $.log $$.divide['__string__']
$$.divide['__string__'] = _.trim _.repeat '- ', 16

$$.recover = co (source) ->

  source = _formatSource source

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

$$.reload = (source) ->

  source = _formatSource source

  livereload.listen()

  $$.watch source
  .pipe livereload()

$$.shell = (cmd) -> new Promise (resolve) ->
  $.shell cmd, -> resolve()

$$.watch = $p.watch