$$.replace = co (args...) ->

  [pathSource, pathTarget, target, replacement] = switch args.length
    when 3 then [args[0], null, args[1], args[2]]
    when 4 then args
    else throw _error 'length'

  pathSource = path.normalize pathSource
  pathTarget or= path.dirname(pathSource).replace /\*/g, ''
  pathTarget = path.normalize pathTarget

  yield new Promise (resolve) ->
    gulp.src pathSource
    .pipe plumber()
    .pipe using()
    .pipe replace target, replacement
    .pipe gulp.dest pathTarget
    .on 'end', -> resolve()

  $.info 'replace'
  , "replaced '#{target}' to '#{replacement}',
    from '#{pathSource}' to '#{pathTarget}'"