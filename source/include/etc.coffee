$$.divide = -> $.log $$.divide['__string__']
$$.divide['__string__'] = _.trim _.repeat '- ', 16

$$.delay = co (time) ->
  yield new Promise (resolve) ->
    $.next time, -> resolve()
  $.info 'delay', "delayed #{time}ms"

$$.watch = $p.watch

$$.reload = (source) ->
  source = _normalizePath source
  livereload.listen()
  $$.watch source
  .pipe livereload()

$$.shell = (cmd) -> new Promise (resolve) ->
  $.shell cmd, -> resolve()