do ->
  fn = $$.compile = co (source, target) ->

    _source = switch typeSource = $.type source
      when 'array' then source[0]
      when 'string' then source
      else throw new Error 'invalid arguments type'

    if !~_source.search /\./ then throw new Error 'invalid suffix'

    suffix = _source.replace /.*\./, ''
    method = switch suffix
      when 'yml' then 'yaml'
      when 'styl' then 'stylus'
      else suffix

    target or= $$.getBase _source

    yield fn[method] source, target

    $.info 'compile'
    , "compiled '#{if typeSource == 'array' then source.join "', '" else source}' to '#{_.trim target, '/'}/'"

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
      .pipe regen()
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
      .pipe regen()
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