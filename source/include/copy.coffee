$$.copy = co (arg...) ->

  [source, target, name] = switch arg.length
    when 2 then [arg[0], arg[1], null]
    when 3 then arg
    else throw _error 'length'

  source = _formatSource source

  yield new Promise (resolve) ->

    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe gulpif !!name, rename name
    .pipe gulp.dest (e) -> target or e.base
    .on 'end', -> resolve()

  msg = "copied '#{source}' to '#{target}'"
  if name then msg += ", as '#{$.parseString name}'"
  $.info 'copy', msg

$$.cp = $$.copy