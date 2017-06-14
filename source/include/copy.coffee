$$.copy = co (arg...) ->

  [source, target, name] = switch arg.length
    when 2 then [arg[0], arg[1], null]
    when 3 then arg
    else throw _error 'length'

  source = _formatSource source

  for src in source

    tar = target or path.dirname src

    yield new Promise (resolve) ->

      gulp.src src
      .pipe plumber()
      .pipe using()
      .pipe gulpif !!name, rename name
      .pipe gulp.dest tar
      .on 'end', -> resolve()

  msg = "copied '#{source}' to '#{target}'"
  if name then msg += ", as '#{$.parseString name}'"
  $.info 'copy', msg

$$.cp = $$.copy