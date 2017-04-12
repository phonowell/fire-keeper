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
      when 'md' then 'markdown'
      when 'styl' then 'stylus'
      else suffix

    target or= path.dirname(source[0]).replace /\*/g, ''
    target = path.normalize target

    option = _.extend
      map: false
      minify: true
    , option

    yield fn[method] source, target, option

    $.info 'compile'
    , "compiled #{("'#{a}'" for a in source).join ', '} to '#{target}'"

  fn.yaml = (source, target, option) -> new Promise (resolve) ->

    option.safe ?= true

    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe yaml option
    .pipe gulp.dest target
    .on 'end', -> resolve()

  fn.stylus = (source, target, option) -> new Promise (resolve) ->

    option.compress ?= option.minify

    gulp.src source
    .pipe plumber()
    .pipe ignore '**/include/**'
    .pipe using()
    .pipe gulpif option.map, sourcemaps.init()
    .pipe stylus option
    .pipe gulpif option.map, sourcemaps.write target
    .pipe gulp.dest target
    .on 'end', -> resolve()

  fn.css = (source, target, option) -> new Promise (resolve) ->

    gulp.src source
    .pipe plumber()
    .pipe ignore '**/include/**'
    .pipe ignore '**/*.min.css'
    .pipe using()
      .pipe gulpif option.map, sourcemaps.init()
    .pipe gulpif option.minify, cleanCss()
    .pipe gulpif option.map, sourcemaps.write target
    .pipe gulp.dest target
    .on 'end', -> resolve()

  fn.coffee = (source, target, option) -> new Promise (resolve) ->

    option.regenerator ?= false

    gulp.src source
    .pipe plumber()
    .pipe ignore '**/include/**'
    .pipe using()
    .pipe gulpif option.map, sourcemaps.init()
    .pipe include()
    .pipe coffee option
    .pipe gulpif option.regenerator, regenerator()
    .pipe gulpif option.minify, uglify()
    .pipe gulpif option.map, sourcemaps.write target
    .pipe gulp.dest target
    .on 'end', -> resolve()

  fn.js = (source, target, option) -> new Promise (resolve) ->

    option.regenerator ?= false

    gulp.src source
    .pipe plumber()
    .pipe ignore '**/include/**'
    .pipe ignore '**/*.min.js'
    .pipe using()
    .pipe gulpif option.map, sourcemaps.init()
    .pipe gulpif option.regenerator, regenerator()
    .pipe gulpif option.minify, uglify()
    .pipe gulpif option.map, sourcemaps.write target
    .pipe gulp.dest target
    .on 'end', -> resolve()

  fn.pug = (source, target, option) -> new Promise (resolve) ->

    option.pretty ?= !option.minify

    gulp.src source
    .pipe plumber()
    .pipe ignore '**/include/**'
    .pipe using()
    .pipe pug option
    .pipe gulp.dest target
    .on 'end', -> resolve()

  fn.jade = (source, target, option) -> new Promise (resolve) ->

    option.pretty ?= !option.minify

    gulp.src source
    .pipe plumber()
    .pipe ignore '**/include/**'
    .pipe using()
    .pipe jade option
    .pipe gulp.dest target
    .on 'end', -> resolve()

  fn.markdown = (source, target, option) -> new Promise (resolve) ->

    option.sanitize ?= true

    gulp.src source
    .pipe plumber()
    .pipe ignore '**/include/**'
    .pipe using()
    .pipe markdown option
    .pipe gulpif option.minify, htmlmin collapseWhitespace: true
    .pipe gulp.dest target
    .on 'end', -> resolve()