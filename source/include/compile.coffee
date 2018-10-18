###
compile_(source, [target], [option])
###

do ->

  # function

  fn_ = (arg...) ->

    [source, target, option] = switch arg.length
      when 1 then [arg[0], null, {}]
      when 2 then do ->
        type = $.type arg[1]
        if type == 'object' then return [arg[0], null, arg[1]]
        if type == 'string' then return [arg[0], arg[1], {}]
        throw new Error 'invalid type'
      when 3 then arg
      else throw new Error 'invalid argument length'

    source = formatPath source

    extname = path.extname source[0]
    .replace /\./, ''
    if !extname.length then throw new Error "invalid extname '#{extname}'"

    method = switch extname
      when 'markdown' then 'md'
      when 'yml' then 'yaml'
      else extname

    target or= path.dirname source[0]
    .replace /\*/g, ''
    target = normalizePath target

    option = _.extend
      map: false
      minify: true
    , option

    compile_ = fn_["#{method}_"]
    if !compile_ then throw new Error 'invalid extname'
    await compile_ source, target, option

    $.info 'compile', "compiled #{wrapList source} to #{wrapList target}"

    $ # return

  ###
  coffee_(source, target, option)
  css_(source, target, option)
  js_(source, target, option)
  md_(source, target, option)
  pug_(source, target, option)
  styl_(source, target, option)
  yaml_(source, target, option)
  ###

  fn_.coffee_ = (source, target, option) ->

    new Promise (resolve) ->

      option.harmony ?= true
      if !option.harmony
        option.transpile =
          presets: ['env']
      delete option.harmony

      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe gulpIf option.map, sourcemaps.init()
      .pipe include()
      .pipe coffee option
      .pipe gulpIf option.minify, uglify()
      .pipe gulpIf option.map, sourcemaps.write ''
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn_.css_ = (source, target, option) ->

    new Promise (resolve) ->

      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe gulpIf option.map, sourcemaps.init()
      .pipe gulpIf option.minify, cleanCss()
      .pipe gulpIf option.map, sourcemaps.write ''
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn_.js_ = (source, target, option) ->

    new Promise (resolve) ->

      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe gulpIf option.map, sourcemaps.init()
      .pipe gulpIf option.minify, uglify()
      .pipe gulpIf option.map, sourcemaps.write ''
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn_.md_ = (source, target, option) ->

    new Promise (resolve) ->

      option.sanitize ?= true

      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe markdown option
      .pipe rename extname: '.html'
      .pipe gulpIf option.minify, htmlmin collapseWhitespace: true
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn_.pug_ = (source, target, option) ->

    new Promise (resolve) ->

      option.pretty ?= !option.minify

      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe pug option
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn_.styl_ = (source, target, option) ->

    new Promise (resolve) ->

      option.compress ?= option.minify

      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe gulpIf option.map, sourcemaps.init()
      .pipe stylus option
      .pipe gulpIf option.map, sourcemaps.write ''
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn_.yaml_ = (source, target, option) ->

    new Promise (resolve) ->

      option.safe ?= true

      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe yaml option
      .pipe gulp.dest target
      .on 'end', -> resolve()

  # return
  $.compile_ = fn_