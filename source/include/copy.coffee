###

  copy(source, target, [option])
  cp(source, target, [option])

###

$$.copy = co (arg...) ->

  # source, target, [option]
  [source, target, option] = switch arg.length
    when 2 then [arg[0], arg[1], null]
    when 3 then arg
    else throw _error 'length'

  source = _formatPath source

  yield new Promise (resolve) ->

    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe gulpif !!option, rename option
    .pipe gulp.dest (e) -> target or e.base
    .on 'end', -> resolve()

  msg = "copied '#{source}' to '#{target}'"
  if option then msg += ", as '#{$.parseString option}'"
  $.info 'copy', msg

  # return
  $$

$$.cp = $$.copy