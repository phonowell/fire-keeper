###
delay([time], [callback])
reload(source)
watch(source)
yargs()
###

$$.delay = (time = 0, callback) ->
  
  await new Promise (resolve) ->
    setTimeout ->
      resolve()
    , time
    
  $.info 'delay', "delayed '#{time} ms'"

  callback?()

  $$ # return

$$.reload = (source) ->

  if !source then throw makeError 'source'

  source = formatPath source

  livereload.listen()

  $$.watch source
  .pipe livereload()

  $$ # return

$$.watch = $p.watch

$$.yargs = $p.yargs