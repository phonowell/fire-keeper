# https://github.com/sindresorhus/gulp-zip
# https://github.com/inuscript/gulp-unzip

###

  unzip(source, [target])
  zip(source, [target], [option])

###

$$.unzip = co (arg...) ->

  [source, target] = switch arg.length
    when 1 then [arg[0], null]
    when 2 then arg
    else throw makeError 'length'

  source = formatPath source
  target or= "#{path.dirname source[0]}/#{path.basename source[0], '.zip'}"
  target = normalizePath target

  yield new Promise (resolve) ->
    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe unzip()
    .pipe gulp.dest target
    .on 'end', -> resolve()

  $.info 'zip', "unzipped #{wrapList source} to #{wrapList target}"

  # return
  $$

$$.zip = co (arg...) ->

  [source, target, option] = switch arg.length
    when 1 then [arg[0], null, {}]
    when 2 then [arg[0], arg[1], {}]
    when 3 then arg
    else throw makeError 'length'

  source = formatPath source
  target or= path.dirname source[0]
  target = normalizePath target

  filename = switch $.type option
    when 'object' then option.filename
    when 'string' then option
    else null
  filename or= "#{path.basename(path.resolve target) or 'zip'}.zip"

  yield new Promise (resolve) ->
    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe zip filename
    .pipe gulp.dest target
    .on 'end', -> resolve()

  $.info 'zip'
  , "zipped #{wrapList source} to #{wrapList target}, named as '#{filename}'"

  # return
  $$
