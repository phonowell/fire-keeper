export default (source) ->

  unless source
    throw 'reload/error: invalid source'

  source = $.normalizePathToArray source

  # require
  livereload = require 'gulp-livereload'

  livereload.listen()

  $.watch source
  .pipe livereload()

  @ # return