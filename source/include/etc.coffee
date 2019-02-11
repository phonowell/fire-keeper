###
delay_([time])
reload(source)
watch(source)
yargs()
###

$.delay_ = (time = 0) ->
  
  await new Promise (resolve) ->
    setTimeout ->
      resolve()
    , time
    
  $.info 'delay', "delayed '#{time} ms'"

  $ # return

$.reload = (source) ->

  unless source
    throw new Error 'invalid source'

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