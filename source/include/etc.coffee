###

  $$.delay(time)
  $$.reload(source)
  $$.shell(cmd)
  $$.watch()

###

$$.delay = co (time = 0) ->
  yield new Promise (resolve) ->
    $.next time, -> resolve()
  $.info 'delay', "delayed '#{time} ms'"

$$.reload = (source) ->

  source = _formatPath source

  livereload.listen()

  $$.watch source
  .pipe livereload()

$$.shell = $.shell

$$.watch = $p.watch