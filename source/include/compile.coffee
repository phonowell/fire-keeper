do ->
  fn = $$.compile = co (args...) ->

    [source, target, option] = switch args.length
      when 1 then [args[0], null, {}]
      when 2
        switch $.type args[1]
          when 'string' then [args[0], args[1], {}]
          when 'object' then [args[0], null, args[1]]
          else throw new Error ERROR.type
      when 3 then args
      else throw new Error ERROR.length

    source = _normalizePath source

    suffix = path.extname(source[0]).replace /\./, ''
    if !suffix.length then throw new Error 'invalid suffix'

    method = switch suffix
      when 'yml' then 'yaml'
      when 'styl' then 'stylus'
      else suffix

    target or= path.dirname(source[0]).replace /\*/g, ''
    target = path.normalize target

    option = _.extend
      regenerator: false
      minify: true
    , option

    yield fn[method] source, target, option

    $.info 'compile'
    , "compiled #{("'#{a}'" for a in source).join ', '} to '#{target}'"

  fn.yaml = (source, target) ->
    new Promise (resolve) ->
      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe yaml()
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn.stylus = (source, target, option) ->
    new Promise (resolve) ->
      gulp.src source
      .pipe plumber()
      .pipe ignore '**/include/**'
      .pipe using()
      .pipe stylus compress: option.minify
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn.css = (source, target, option) ->
    new Promise (resolve) ->
      gulp.src source
      .pipe plumber()
      .pipe ignore '**/include/**'
      .pipe ignore '**/*.min.css'
      .pipe using()
      .pipe gulpif option.minify, cleanCss()
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn.coffee = (source, target, option) ->
    new Promise (resolve) ->
      gulp.src source
      .pipe plumber()
      .pipe ignore '**/include/**'
      .pipe using()
      .pipe include()
      .pipe coffee()
      .pipe gulpif option.regenerator, regenerator()
      .pipe gulpif option.minify, uglify()
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn.js = (source, target, option) ->
    new Promise (resolve) ->
      gulp.src source
      .pipe plumber()
      .pipe ignore '**/include/**'
      .pipe ignore '**/*.min.js'
      .pipe using()
      .pipe gulpif option.regenerator, regenerator()
      .pipe gulpif option.minify, uglify()
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn.jade = (source, target, option) ->
    new Promise (resolve) ->
      gulp.src source
      .pipe plumber()
      .pipe ignore '**/include/**'
      .pipe using()
      .pipe jade pretty: !option.minify
      .pipe gulp.dest target
      .on 'end', -> resolve()