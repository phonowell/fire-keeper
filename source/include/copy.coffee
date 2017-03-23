$$.copy = co (source, target = './') ->

  source = _normalizePath source
  target = path.normalize target

  yield new Promise (resolve) ->
    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe gulp.dest target
    .on 'end', -> resolve()

  $.info 'copy', "copied '#{source}' to '#{target}'"

$$.cp = $$.copy