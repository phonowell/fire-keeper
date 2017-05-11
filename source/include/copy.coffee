$$.copy = co (source, target = './', name) ->

  source = _normalizePath source
  target = path.normalize target

  yield new Promise (resolve) ->
    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe gulpif name, rename name
    .pipe gulp.dest target
    .on 'end', -> resolve()

  msg = "copied '#{source}' to '#{target}'"
  if name then msg += ", as '#{$.parseString name}'"
  $.info 'copy', msg

$$.cp = $$.copy