###
delay_([time], [callback])
reload(source)
watch(source)
yargs()
###

$.delay_ = (time = 0, callback) ->
  
  await new Promise (resolve) ->
    setTimeout ->
      resolve()
    , time
    
  $.info 'delay', "delayed '#{time} ms'"

  callback?()

  $ # return

$.reload = (source) ->

  if !source then throw new Error 'invalid source'

  source = normalizePathToArray source

  # require
  livereload = getPlugin 'gulp-livereload'

  livereload.listen()

  $.watch source
  .pipe livereload()

  $ # return

$.watch = getPlugin 'gulp-watch'

$.yargs = getPlugin 'yargs'
$.argv = $.plugin.yargs.argv