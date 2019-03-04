###
reload(source)
watch(source)
yargs()
###

$.reload = (source) ->

  unless source
    throw new Error 'invalid source'

  source = normalizePathToArray source

  # require
  livereload = require 'gulp-livereload'

  livereload.listen()

  $.watch source
  .pipe livereload()

  $ # return

$.watch = require 'gulp-watch'

$.yargs = require 'yargs'
$.argv = $.yargs.argv