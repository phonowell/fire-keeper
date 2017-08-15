###

  delay()
  reload(source)
  shell(cmd)
  watch()

###

$$.delay = $.delay

$$.reload = (source) ->

  source = _formatPath source

  livereload.listen()

  $$.watch source
  .pipe livereload()

  # return
  $$

$$.shell = $.shell

$$.watch = $p.watch