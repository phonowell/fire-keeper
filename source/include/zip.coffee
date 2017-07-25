###

  $$.unzip()
  $$.zip(source, target)

###

$$.unzip = co (source, target) ->

  source = path.normalize source
  target = path.normalize target

  yield new Promise (resolve) ->
    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe unzip()
    .pipe gulp.dest target
    .on 'end', ->

      $.info 'unzip', "unzipped '#{source}' to '#{target}'"

      resolve()

$$.zip = co (source, target = './zip.zip') ->

  source = _formatSource source
  target = path.normalize target

  dirname = path.dirname target
  filename = path.basename target

  yield new Promise (resolve) ->
    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe zip filename
    .pipe gulp.dest dirname
    .on 'end', ->

      $.info 'zip', "zipped '#{source}' to '#{target}'"

      resolve()