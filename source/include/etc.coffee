###

  delay([time])
  reload(source)
  shell(cmd)
  watch(source)
  yargs()

###

$$.delay = $.delay

$$.reload = (source) ->

  if !source then throw makeError 'source'

  source = formatPath source

  livereload.listen()

  $$.watch source
  .pipe livereload()

  # return
  $$

$$.shell = $.shell

$$.watch = $p.watch

$$.yargs = $p.yargs