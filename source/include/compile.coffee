###

  compile(source, [target], [option])

###

do ->

  # function

  fn = co (arg...) ->

    [source, target, option] = switch arg.length
      when 1 then [arg[0], null, {}]
      when 2 then do ->
        type = $.type arg[1]
        if type == 'object' then return [arg[0], null, arg[1]]
        if type == 'string' then return [arg[0], arg[1], {}]
        throw makeError 'type'
      when 3 then arg
      else throw makeError 'length'

    source = formatPath source

    extname = path.extname(source[0]).replace /\./, ''
    if !extname.length then throw makeError 'extname'

    method = switch extname
      when 'yaml', 'yml' then 'yaml'
      when 'md' then 'markdown'
      when 'styl' then 'stylus'
      else extname

    target or= path.dirname(source[0]).replace /\*/g, ''
    target = normalizePath target

    option = _.extend
      map: false
      minify: true
    , option

    compiler = fn[method]
    if !compiler then throw makeError "invalid extname: '.#{extname}'"
    yield compiler source, target, option

    $.info 'compile', "compiled #{wrapList source} to #{wrapList target}"

    # return
    $$

  ###

    coffee(source, target, option)
    css(source, target, option)
    js(source, target, option)
    markdown(source, target, option)
    pug(source, target, option)
    stylus(source, target, option)
    yaml(source, target, option)

  ###

  fn.coffee = (source, target, option) ->

    new Promise (resolve) ->

      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe gulpif option.map, sourcemaps.init()
      .pipe include()
      .pipe coffee option
      .pipe gulpif option.minify, uglify()
      .pipe gulpif option.map, sourcemaps.write ''
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn.css = (source, target, option) ->

    new Promise (resolve) ->

      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe gulpif option.map, sourcemaps.init()
      .pipe gulpif option.minify, cleanCss()
      .pipe gulpif option.map, sourcemaps.write ''
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn.js = (source, target, option) ->

    new Promise (resolve) ->

      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe gulpif option.map, sourcemaps.init()
      .pipe gulpif option.minify, uglify()
      .pipe gulpif option.map, sourcemaps.write ''
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn.markdown = (source, target, option) ->

    new Promise (resolve) ->

      option.sanitize ?= true

      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe markdown option
      .pipe gulpif option.minify, htmlmin collapseWhitespace: true
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn.pug = (source, target, option) ->

    new Promise (resolve) ->

      option.pretty ?= !option.minify

      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe pug option
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn.stylus = (source, target, option) ->

    new Promise (resolve) ->

      option.compress ?= option.minify

      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe gulpif option.map, sourcemaps.init()
      .pipe stylus option
      .pipe gulpif option.map, sourcemaps.write ''
      .pipe gulp.dest target
      .on 'end', -> resolve()

  fn.yaml = (source, target, option) ->

    new Promise (resolve) ->

      option.safe ?= true

      gulp.src source
      .pipe plumber()
      .pipe using()
      .pipe yaml option
      .pipe gulp.dest target
      .on 'end', -> resolve()

  # return
  $$.compile = fn