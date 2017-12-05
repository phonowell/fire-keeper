# https://github.com/lazd/gulp-replace

###

  replace(pathSource, [pathTarget], target, replacement)

###

$$.replace = co (arg...) ->

  [pathSource, pathTarget, target, replacement] = switch arg.length
    when 3 then [arg[0], null, arg[1], arg[2]]
    when 4 then arg
    else throw makeError 'length'

  pathSource = formatPath pathSource
  pathTarget or= path.dirname(pathSource[0]).replace /\*/g, ''
  pathTarget = normalizePath pathTarget

  yield new Promise (resolve) ->
    gulp.src pathSource
    .pipe plumber()
    .pipe using()
    .pipe replace target, replacement
    .pipe gulp.dest pathTarget
    .on 'end', -> resolve()

  $.info 'replace'
  , "replaced '#{target}' to '#{replacement}',
    in #{wrapList pathSource},
    output to #{wrapList pathTarget}"

  # return
  $$