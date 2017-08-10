###

  delay(time)
  reload(source)
  shell(cmd)
  watch()

###

$$.delay = co (time = 0) ->

  yield new Promise (resolve) ->
    $.next time, -> resolve()

  $.info 'delay', "delayed '#{time} ms'"

  # return
  $$

$$.reload = (source) ->

  source = _formatPath source

  livereload.listen()

  $$.watch source
  .pipe livereload()

  # return
  $$

$$.shell = $.shell

$$.watch = $p.watch