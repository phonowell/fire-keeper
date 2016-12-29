# require
$ = require 'node-jquery-extend'
_ = $._

Promise = require 'bluebird'
co = Promise.coroutine

# require
require 'gulp-util'
watch = require 'gulp-watch'
plumber = require 'gulp-plumber'
ignore = require 'gulp-plumber'
rename = require 'gulp-rename'
include = require 'gulp-include'
replace = require 'gulp-replace'
using = require 'gulp-using'

_jade = require 'gulp-jade'
_coffee = require 'gulp-coffee'
_stylus = require 'gulp-stylus'
_yaml = require 'gulp-yaml'

jade = -> _jade pretty: false
coffee = -> _coffee map: false
stylus = -> _stylus compress: true
yaml = -> _yaml safe: true

uglify = require 'gulp-uglify'
minCss = require 'gulp-clean-css'

coffeelint = require 'gulp-coffeelint'
reload = require 'gulp-livereload'

$$ = (arg) -> $$.use arg

$$.use = (gulp) ->

  # variable

  # os
  $$.os = do ->
    string = process.platform
    if ~string.search 'darwin' then 'macos'
    else if ~string.search 'win' then 'windows'
    else 'linux'

  # path
  $$.path =
    gulp: './gulpfile.js'
    source: './source'
    build: './build'
    secret: './secret'

  $$.path.jade = "#{$$.path.source}/**/*.jade"
  $$.path.stylus = "#{$$.path.source}/**/*.styl"
  $$.path.coffee = "#{$$.path.source}/**/*.coffee"
  $$.path.yaml = "#{$$.path.secret}/**/*.yml"

  # function

  $$.divide = -> $.log $$.divide['__string__']
  $$.divide['__string__'] = _.trim _.repeat '- ', 16

  # listen
  do ->
    fn = $$.listen = (list) ->

      if $.type(list) != 'array' then list = [list]

      for a in list
        if ~a.search /\.coffee/ then fn.coffee a
        else if ~a.search /\.styl/ then fn.stylus a
        else if ~a.search /\.yml/ then fn.yaml a
        else throw 'type error'

    fn.upper = (src) ->
      arr = src.split '/'
      arr.pop()
      arr.join '/'

    fn.coffee = (src) ->
      deb = _.debounce ->
        gulp.src path = fn.upper src
        .pipe plumber()
        .pipe using()
        .pipe include()
        .pipe coffee()
        .pipe gulp.dest path
      , 1e3
      watch "#{path}/include/**/*.coffee", deb

    fn.stylus = (src) ->
      deb = _.debounce ->
        gulp.src path = fn.upper src
        .pipe plumber()
        .pipe using()
        .pipe stylus()
        .pipe gulp.dest path
      , 1e3
      watch "#{path}/include/**/*.coffee", deb

    fn.yaml = (src) ->
      deb = _.debounce ->
        gulp.src path = fn.upper src
        .pipe plumber()
        .pipe using()
        .pipe yaml()
        .pipe gulp.dest path
      , 1e3
      watch "#{path}/include/**/*.yml", deb

  # reload
  $$.reload = ->
    reload.listen()
    watch "#{$$.path.source}/**/*.css"
    .pipe reload()

  # build
  do ->

    fn = $$.build = (map) -> fn.reduce map

    fn['__map__'] = {}

    fn.reduce = co (map) ->

      list = (key for key of map)
      i = 0

      do step = co ->
        isEnded = i >= list.length

        $$.divide()
        $.info 'step', "run step <#{if isEnded then 'callback' else key = list[i]}>"

        if isEnded then return

        yield (fn.select key) map[key]

        i++
        step()

    fn.select = (key) -> fn['__map__'][key]

    fn.add = (key, func) ->
      if fn.select key then throw 'function already existed'
      fn['__map__'][key] = func

    fn.remove = (key) -> delete fn['__map__'][key]

    # add default function

    fn.add 'prepare', co ->
      path = $$.path.build

      yield del path, force: true

      $.info 'mkdir', path
      fs.mkdirSync path

    fn.add 'copy', (src) ->
      new Promise (resolve) ->
        base = $$.path.source
        gulp.src src, base: base
        .pipe plumber()
        .pipe using()
        .pipe gulp.dest base
        .on 'end', -> resolve()

    fn.add 'other', co (list = []) ->
      list = _.uniq list.concat(['png', 'jpg', 'gif', 'json', 'ttf']), true
      yield (fn.select 'copy') ("#{$$.path.source}/**/*.#{a}" for a in list)

    fn.add 'yaml', co -> yield $$.compile 'secret'

    fn.add 'stylus', -> co -> yield $$.compile 'stylus', $$.path.build

    fn.add 'css', co ->
      yield $$.compile 'css', $$.path.build
      yield (fn.select 'copy') "#{$$.path.source}/**/*.min.css"

    fn.add 'coffee', co -> yield $$.compile 'coffee', $$.path.build

    fn.add 'js', co ->
      yield $$.compile 'js', $$.path.build
      yield (fn.select 'copy') "#{$$.path.source}/**/*.min.js"

    fn.add 'jade', co -> yield $$.compile 'jade', $$.path.build

    fn.add 'clean', co (list) ->
      yield del list, force: true
      $.info 'clean', (a for a in list).join ', '

  # lint
  do ->
    fn = $$.lint = (key) -> fn[key]()

    fn.coffee = ->
      new Promise (resolve) ->
        gulp.src $$.path.coffee
        .pipe plumber()
        .pipe using()
        .pipe coffeelint()
        .pipe coffeelint.reporter()
        .on 'end', -> resolve()

  # compile
  do ->
    fn = $$.compile = (key, target) -> fn[key] target

    fn.gulpfile = (target = '') ->
      new Promise (resolve) ->
        gulp.src './gulpfile.coffee'
        .pipe plumber()
        .pipe using()
        .pipe coffee()
        .pipe gulp.dest target
        .on 'end', -> resolve()

    fn.coffeelint = (target = '') ->
      new Promise (resolve) ->
        gulp.src './coffeelint.yml'
        .pipe plumber()
        .pipe using()
        .pipe yaml()
        .pipe gulp.dest target
        .on 'end', -> resolve()

    fn.secret = (target = $$.path.secret) ->
      new Promise (resolve) ->
        base = $$.path.secret
        gulp.src "#{base}/**/*.yml", base: base
        .pipe plumber()
        .pipe using()
        .pipe yaml()
        .pipe gulp.dest target
        .on 'end', -> resolve()

    fn.stylus = (target = $$.path.source) ->
      new Promise (resolve) ->
        base = $$.path.source
        gulp.src "#{base}/**/*.styl", base: base
        .pipe plumber()
        .pipe ignore '**/include/**'
        .pipe using()
        .pipe stylus()
        .pipe gulp.dest target
        .on 'end', -> resolve()

    fn.css = (target = $$.path.source) ->
      new Promise (resolve) ->
        base = $$.path.source
        gulp.src "#{base}/**/*.css", base: base
        .pipe plumber()
        .pipe ignore '**/include/**'
        .pipe ignore '**/*.min.css'
        .pipe using()
        .pipe minCss()
        .pipe gulp.dest target
        .on 'end', -> resolve()

    fn.coffee = (target = $$.path.source) ->
      new Promise (resolve) ->
        base = $$.path.source
        gulp.src "#{base}/**/*.coffee", base: base
        .pipe plumber()
        .pipe ignore '**/include/**'
        .pipe using()
        .pipe include()
        .pipe coffee()
        .pipe uglify()
        .pipe gulp.dest target
        .on 'end', -> resolve()

    fn.js = (target = $$.path.source) ->
      new Promise (resolve) ->
        base = $$.path.source
        gulp.src "#{base}/**/*.js", base: base
        .pipe plumber()
        .pipe ignore '**/include/**'
        .pipe ignore '**/*.min.js'
        .pipe using()
        .pipe uglify()
        .pipe gulp.dest target
        .on 'end', -> resolve()

    fn.jade = (target = $$.path.source) ->
      new Promise (resolve) ->
        base = $$.path.source
        gulp.src "#{base}/**/*.jade", base: base
        .pipe plumber()
        .pipe ignore '**/include/**'
        .pipe using()
        .pipe jade()
        .pipe gulp.dest target
        .on 'end', -> resolve()

module.exports = $$