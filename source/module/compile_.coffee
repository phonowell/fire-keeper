gulp = require 'gulp'
gulpIf = require 'gulp-if'
using = require 'gulp-using'

class M

  ###
  mapMethod
  ###

  mapMethod:
    '.coffee': 'compileCoffee_'
    '.css': 'compileCss_'
    '.js': 'compileJs_'
    '.md': 'compileMd_'
    '.pug': 'compilePug_'
    '.styl': 'compileStyl_'
    '.ts': 'compileTs_'
    '.yaml': 'compileYaml_'
    '.yml': 'compileYaml_'


  ###
  compileCoffee_(source, target, option)
  compileCss_(source, target, option)
  compileJs_(source, target, option)
  compileMd_(source, target, option)
  compilePug_(source, target, option)
  compileStyl_(source, target, option)
  compileTs_(source, target, option)
  compileYaml_(source, target, option)
  execute_(arg...)
  ###

  compileCoffee_: (source, target, option) ->
    
    await new Promise (resolve) ->

      coffee = require 'gulp-coffee'
      include = require 'gulp-include'
      uglify = getPlugin 'uglify'

      base = option.base
      sourcemaps = option.map

      gulp.src source, {base, sourcemaps}
      .pipe using()
      .pipe include()
      .pipe coffee option
      .pipe gulpIf option.minify, uglify()
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()
    
    @ # return

  compileCss_: (source, target, option) ->

    await new Promise (resolve) ->

      cleanCss = require 'gulp-clean-css'

      base = option.base
      sourcemaps = option.map

      gulp.src source, {base, sourcemaps}
      .pipe using()
      .pipe gulpIf option.minify, cleanCss()
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

    @ # return

  compileJs_: (source, target, option) ->

    await new Promise (resolve) ->

      uglify = getPlugin 'uglify'

      base = option.base
      sourcemaps = option.map

      gulp.src source, {base, sourcemaps}
      .pipe using()
      .pipe gulpIf option.minify, uglify()
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

    @ # return

  compileMd_: (source, target, option) ->

    await new Promise (resolve) ->

      htmlmin = require 'gulp-htmlmin'
      markdown = require 'gulp-markdown'
      rename = require 'gulp-rename'

      option.sanitize ?= true
      base = option.base
      sourcemaps = option.map

      gulp.src source, {base, sourcemaps}
      .pipe using()
      .pipe markdown option
      .pipe rename extname: '.html'
      .pipe gulpIf option.minify, htmlmin collapseWhitespace: true
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

    @ # return

  compilePug_: (source, target, option) ->

    await new Promise (resolve) ->

      pug = require 'gulp-pug'

      option.pretty ?= !option.minify
      base = option.base
      sourcemaps = option.map

      gulp.src source, {base, sourcemaps}
      .pipe using()
      .pipe pug option
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

    @ # return

  compileStyl_: (source, target, option) ->

    await new Promise (resolve) ->

      stylus = require 'gulp-stylus'

      option.compress ?= option.minify
      base = option.base
      sourcemaps = option.map

      gulp.src source, {base, sourcemaps}
      .pipe using()
      .pipe stylus option
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

    @ # return

  compileTs_: (source, target, option) ->

    await new Promise (resolve) ->

      ts = require 'gulp-typescript'
      uglify = getPlugin 'uglify'

      base = option.base
      isMinify = option.minify
      sourcemaps = option.map

      # have to delete these unknown options
      delete option.map
      delete option.minify

      gulp.src source, {base, sourcemaps}
      .pipe using()
      .pipe ts option
      .pipe gulpIf isMinify, uglify()
      .pipe gulp.dest target, {sourcemaps}
      .on 'end', -> resolve()

    @ # return

  compileYaml_: (source, target, option) ->

    await new Promise (resolve) ->

      yaml = require 'gulp-yaml'

      option.safe ?= true
      base = option.base
      sourcemaps = option.map

      gulp.src source, {base}
      .pipe using()
      .pipe yaml option
      .pipe gulp.dest target
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

# return
$.compile_ = (arg...) ->
  m = new M()
  await m.execute_ arg...
  $ # return