# https://github.com/sindresorhus/gulp-zip
# https://github.com/inuscript/gulp-unzip

###

  unzip(source, [target])
  zip(source, target, option)

###

$$.unzip = (source, target) ->

  if !source
    throw makeError 'source'

  source = await $$.source source

  for src in source

    dist = target or path.dirname src

    await new Promise (resolve) ->
      gulp.src src
      .pipe plumber()
      .pipe using()
      .pipe unzip()
      .pipe gulp.dest dist
      .on 'end', -> resolve()

    $.info 'zip', "unzipped #{src} to #{dist}"

  $$ # return

$$.zip = (arg...) ->

  [source, target, option] = switch arg.length
    when 1 then [arg[0], null, null]
    when 2 then [arg[0], null, arg[1]]
    when 3 then arg
    else throw makeError 'length'

  source = formatPath source

  target or= path.dirname(source[0]).replace /\*/g, ''
  target = normalizePath target

  filename = switch $.type option
    when 'object' then option.filename
    when 'string' then option
    else null
  filename or= "#{path.basename target}.zip"

  await new Promise (resolve) ->
    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe zip filename
    .pipe gulp.dest target
    .on 'end', -> resolve()

  $.info 'zip'
  , "zipped #{wrapList source} to #{wrapList target}, named as '#{filename}'"

  $$ # return