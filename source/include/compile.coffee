do ->
  fn = $$.compile = co (source, target) ->

    if !~source.search /\./ then throw 'got no suffix'

    suffix = source.replace /.*\./, ''
    method = switch suffix
      when 'yml' then 'yaml'
      when 'styl' then 'stylus'
      else suffix

    target or= $$.getBase source

    yield fn[method] source, target

    $.info 'compile', "compiled '#{source}' to '#{target}/'"


  fn.yaml = (source, target) ->
    new Promise (resolve) ->
      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe yaml()
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn.stylus = (source, target) ->
    new Promise (resolve) ->
      gulp.src source
      .pipe plumber()
      .pipe ignore '**/include/**'
      .pipe using()
      .pipe stylus()
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn.css = (source, target) ->
    new Promise (resolve) ->
      gulp.src source
      .pipe plumber()
      .pipe ignore '**/include/**'
      .pipe ignore '**/*.min.css'
      .pipe using()
      .pipe cleanCss()
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn.coffee = (source, target) ->
    new Promise (resolve) ->
      gulp.src source
      .pipe plumber()
      .pipe ignore '**/include/**'
      .pipe using()
      .pipe include()
      .pipe coffee()
      .pipe uglify()
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn.js = (source, target) ->
    new Promise (resolve) ->
      gulp.src source
      .pipe plumber()
      .pipe ignore '**/include/**'
      .pipe ignore '**/*.min.js'
      .pipe using()
      .pipe uglify()
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn.jade = (source, target) ->
    new Promise (resolve) ->
      gulp.src source
      .pipe plumber()
      .pipe ignore '**/include/**'
      .pipe using()
      .pipe jade()
      .pipe gulp.dest target
      .on 'end', -> resolve()