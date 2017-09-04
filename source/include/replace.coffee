# https://github.com/lazd/gulp-replace

###

  replace(pathSource, [pathTarget], target, replacement)

###

$$.replace = co (arg...) ->

  [pathSource, pathTarget, target, replacement] = switch arg.length
    when 3 then [arg[0], null, arg[1], arg[2]]
    when 4 then arg
    else throw _error 'length'

  pathSource = _formatPath pathSource
  pathTarget or= path.dirname(pathSource[0]).replace /\*/g, ''
  pathTarget = _normalizePath pathTarget

  yield new Promise (resolve) ->
    gulp.src pathSource
    .pipe plumber()
    .pipe using()
    .pipe replace target, replacement
    .pipe gulp.dest pathTarget
    .on 'end', -> resolve()

  $.info 'replace'
  , "replaced '#{target}' to '#{replacement}',
    in #{_wrapList pathSource},
    output to #{_wrapList pathTarget}"

  # return
  $$
