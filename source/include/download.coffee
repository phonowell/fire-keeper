$$.download = co (arg...) ->

  [source, target, option] = switch arg.length
    when 2 then [arg[0], arg[1], null]
    when 3 then arg
    else throw _error 'length'

  target = path.normalize target

  yield new Promise (resolve) ->

    download source
    .pipe plumber()
    #.pipe using()
    .pipe gulpif !!option, rename option
    .pipe gulp.dest target
    .on 'end', -> resolve()

  msg = "downloaded '#{source}' to '#{target}'"
  if option then msg += ", as '#{$.parseString option}'"
  $.info 'copy', msg