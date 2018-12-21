###
compile_(source, [target], [option])
###

class Compiler

  ###
  mapMethod
  ###

  mapMethod:
    '.coffee': 'coffee_'
    '.css': 'css_'
    '.js': 'js_'
    '.md': 'markdown_'
    '.pug': 'pug_'
    '.styl': 'stylus_'
    '.yaml': 'yaml_'
    '.yml': 'yaml_'


  ###
  coffee_(source, target, option)
  css_(source, target, option)
  execute_(arg...)
  js_(source, target, option)
  markdown_(source, target, option)
  pug_(source, target, option)
  stylus_(source, target, option)
  yaml_(source, target, option)
  ###

  coffee_: (source, target, option) ->
    
    await new Promise (resolve) ->

      coffee = getPlugin 'gulp-coffee'
      include = getPlugin 'gulp-include'
      uglify = getPlugin 'uglify'

      option.harmony ?= true
      unless option.harmony
        option.transpile =
          presets: ['env']
      delete option.harmony

      base = option.base
      sourcemaps = option.map

      gulp.src source, {base, sourcemaps}
      .pipe plumber()
      .pipe using()
      .pipe include()
      .pipe coffee option
      .pipe gulpIf option.minify, uglify()
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()
    
    @ # return

  css_: (source, target, option) ->

    await new Promise (resolve) ->

      cleanCss = getPlugin 'gulp-clean-css'

      base = option.base
      sourcemaps = option.map

      gulp.src source, {base, sourcemaps}
      .pipe plumber()
      .pipe using()
      .pipe gulpIf option.minify, cleanCss()
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

    @ # return

  execute_: (arg...) ->

    [source, target, option] = switch arg.length
      when 1 then [arg[0], null, {}]
      when 2 then do ->
        type = $.type arg[1]
        if type == 'object'
          return [arg[0], null, arg[1]]
        if type == 'string'
          return [arg[0], arg[1], {}]
        throw new Error "invalid type '#{type}'"
      when 3 then arg
      else throw new Error 'invalid argument length'

    option = _.extend
      map: false
      minify: true
    , option

    # message
    msg = "compiled #{wrapList source}"
    if target
      msg += " to #{wrapList target}"

    # base
    type = $.type source
    if type == 'string' and ~source.search /\/\*/
      option.base or= normalizePath source
      .replace /\/\*.*/, ''

    # each & compile
    listSource = await $.source_ source
    for source in listSource
      {extname, dirname} = $.getName source

      method = @mapMethod[extname]
      method or throw new Error "invalid extname '#{extname}'"

      target or= dirname
      target = normalizePath target

      await @[method] source, target, option

    $.info 'compile', msg

    @ # return

  js_: (source, target, option) ->

    await new Promise (resolve) ->

      uglify = getPlugin 'uglify'

      base = option.base
      sourcemaps = option.map

      gulp.src source, {base, sourcemaps}
      .pipe plumber()
      .pipe using()
      .pipe gulpIf option.minify, uglify()
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

    @ # return

  markdown_: (source, target, option) ->

    await new Promise (resolve) ->

      htmlmin = getPlugin 'gulp-htmlmin'
      markdown = getPlugin 'gulp-markdown'
      rename = getPlugin 'gulp-rename'

      option.sanitize ?= true
      base = option.base
      sourcemaps = option.map

      gulp.src source, {base, sourcemaps}
      .pipe plumber()
      .pipe using()
      .pipe markdown option
      .pipe rename extname: '.html'
      .pipe gulpIf option.minify, htmlmin collapseWhitespace: true
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

    @ # return

  pug_: (source, target, option) ->

    await new Promise (resolve) ->

      pug = getPlugin 'gulp-pug'

      option.pretty ?= !option.minify
      base = option.base
      sourcemaps = option.map

      gulp.src source, {base, sourcemaps}
      .pipe plumber()
      .pipe using()
      .pipe pug option
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

    @ # return

  stylus_: (source, target, option) ->

    await new Promise (resolve) ->

      stylus = getPlugin 'gulp-stylus'

      option.compress ?= option.minify
      base = option.base
      sourcemaps = option.map

      gulp.src source, {base, sourcemaps}
      .pipe plumber()
      .pipe using()
      .pipe stylus option
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

    @ # return

  yaml_: (source, target, option) ->

    await new Promise (resolve) ->

      yaml = getPlugin 'gulp-yaml'

      option.safe ?= true
      base = option.base
      sourcemaps = option.map

      gulp.src source, {base, sourcemaps}
      .pipe plumber()
      .pipe using()
      .pipe yaml option
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

    @ # return

# return
$.compile_ = (arg...) ->
  compiler = new Compiler()
  await compiler.execute_ arg...
  $ # return