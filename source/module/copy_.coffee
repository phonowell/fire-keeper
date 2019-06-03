gulp = require 'gulp'
gulpIf = require 'gulp-if'
using = require 'gulp-using'

# return
$.copy_ = (arg...) ->

  # source, target, [option]
  [source, target, option] = switch arg.length
    when 2 then [arg[0], arg[1], null]
    when 3 then arg
    else throw new Error 'invalid argument length'

  source = normalizePathToArray source
  target = normalizePath target
  
  unless source.length
    return $

  await new Promise (resolve) ->

    # require
    rename = require 'gulp-rename'

    gulp.src source,
      allowEmpty: true
    .pipe using()
    .pipe gulpIf !!option, rename option
    .pipe gulp.dest (e) -> target or e.base
    .on 'end', -> resolve()

  msg = "copied #{wrapList source}
  to #{wrapList target}"
  if option
    msg += ", as '#{$.parseString option}'"
  $.info 'copy', msg

  $ # return
