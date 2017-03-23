$$.zip = co (origin, target = './zip.zip') ->

  origin = _normalizePath origin
  target = path.normalize target

  dirname = path.dirname target
  filename = path.basename target

  yield new Promise (resolve) ->
    gulp.src origin
    .pipe plumber()
    .pipe using()
    .pipe zip filename
    .pipe gulp.dest dirname
    .on 'end', -> resolve()

  $.info 'zip', "zipped '#{origin}' to '#{target}'"