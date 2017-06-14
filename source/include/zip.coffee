$$.zip = co (source, target = './zip.zip') ->

  source = _formatSource source
  target = path.normalize target

  dirname = path.dirname target
  filename = path.basename target

  yield new Promise (resolve) ->
    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe zip filename
    .pipe gulp.dest dirname
    .on 'end', -> resolve()

  $.info 'zip', "zipped '#{source}' to '#{target}'"