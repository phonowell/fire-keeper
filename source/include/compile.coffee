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

    source = normalizePathToArray source

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

    await new Promise (resolve) ->

      # require
      coffee = getPlugin 'gulp-coffee'
      include = getPlugin 'gulp-include'
      uglify = getPlugin 'uglify'

      option.harmony ?= true
      if !option.harmony
        option.transpile =
          presets: ['env']
      delete option.harmony

      sourcemaps = option.map

      gulp.src source, {sourcemaps}
      .pipe plumber()
      .pipe using()
      .pipe include()
      .pipe coffee option
      .pipe gulpIf option.minify, uglify()
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

  fn_.css_ = (source, target, option) ->

    await new Promise (resolve) ->

      # require
      cleanCss = getPlugin 'gulp-clean-css'

      sourcemaps = option.map

      gulp.src source, {sourcemaps}
      .pipe plumber()
      .pipe using()
      .pipe gulpIf option.minify, cleanCss()
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

  fn_.js_ = (source, target, option) ->

    await new Promise (resolve) ->

      # require
      uglify = getPlugin 'uglify'

      sourcemaps = option.map

      gulp.src source, {sourcemaps}
      .pipe plumber()
      .pipe using()
      .pipe gulpIf option.minify, uglify()
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

  fn_.md_ = (source, target, option) ->

    await new Promise (resolve) ->

      # require
      htmlmin = getPlugin 'gulp-htmlmin'
      markdown = getPlugin 'gulp-markdown'
      rename = getPlugin 'gulp-rename'

      option.sanitize ?= true

      sourcemaps = option.map

      gulp.src source, {sourcemaps}
      .pipe plumber()
      .pipe using()
      .pipe markdown option
      .pipe rename extname: '.html'
      .pipe gulpIf option.minify, htmlmin collapseWhitespace: true
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

  fn_.pug_ = (source, target, option) ->

    await new Promise (resolve) ->

      # require
      pug = getPlugin 'gulp-pug'

      option.pretty ?= !option.minify

      sourcemaps = option.map

      gulp.src source, {sourcemaps}
      .pipe plumber()
      .pipe using()
      .pipe pug option
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

  fn_.styl_ = (source, target, option) ->

    await new Promise (resolve) ->

      # require
      stylus = getPlugin 'gulp-stylus'

      option.compress ?= option.minify

      sourcemaps = option.map

      gulp.src source, {sourcemaps}
      .pipe plumber()
      .pipe using()
      .pipe stylus option
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

  fn_.yaml_ = (source, target, option) ->

    await new Promise (resolve) ->

      # require
      yaml = getPlugin 'gulp-yaml'

      option.safe ?= true

      sourcemaps = option.map

      gulp.src source, {sourcemaps}
      .pipe plumber()
      .pipe using()
      .pipe yaml option
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

  # return
  $.compile_ = fn_