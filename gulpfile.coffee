# require
fs = require 'fs'

$ = require 'node-jquery-extend' # jquery
_ = $._ # lodash

del = require 'del'
argv = require('minimist') process.argv.slice 2
os = require 'os'

# gulp
gulp = require 'gulp'

gutil = require 'gulp-util'
watch = require 'gulp-watch'
plumber = require 'gulp-plumber'
ignore = require 'gulp-ignore'
rename = require 'gulp-rename'
include = require 'gulp-include'
replace = require 'gulp-replace'
using = require 'gulp-using'

jade = require 'gulp-jade'
coffee = require 'gulp-coffee'
stylus = require 'gulp-stylus'
yaml = require 'gulp-yaml'

uglify = require 'gulp-uglify'
minCss = require 'gulp-clean-css'

coffeelint = require 'gulp-coffeelint'
reload = require 'gulp-livereload'

# function

# $.divide()
$.divide = -> $.log _.repeat '-', 8

# $.task()
$.task = (name, fn) ->
  d = $.task.data or= {}

  if !fn then return d[name]

  gulp.task name, ->
    $.divide()
    $.info 'base', "Running at #{project.base}"
    d[name]()

  d[name] = fn

# $.os()
$.os = ->
  string = process.platform
  if ~string.search 'darwin' then 'macos'
  else if ~string.search 'win' then 'windows'
  else 'linux'

# project
project =
  base: process.cwd()
project.name = project.base.replace /.*\\|.*\//, ''

# tamako
for a in ['tamako', 'doremi']
  if project.name != a and ~project.name.search a
    project.name = a

# cordova
if project.name in ['tamako', 'shiro']
  project.withCordova = true

# path
path = project.path =
  gulp: 'gulpfile.js'
  source: './source'
  build: './build'
  secret: './secret'

# build
if project.withCordova
  path.build = './www'

path.jade = "#{path.source}/**/*.jade"
path.stylus = "#{path.source}/**/*.styl"
path.coffee = "#{path.source}/**/*.coffee"
path.yaml = "#{path.secret}/**/*.yml"

# kokoro
if project.name == 'kokoro'
  path.gulp = 'gulpfile.coffee'
  path.coffee = [path.coffee, path.gulp]

# config
config = project.config =
  minify: !argv.M # minify

_jade = -> jade pretty: !config.minify
_coffee = -> coffee map: true
_stylus = -> stylus compress: config.minify
_yaml = -> yaml safe: true

_uglify = -> gulpif config.minify, uglify()
_minCss = -> gulpif config.minify, minCss()

# watch
$.task 'watch', ->

  fn = {}

  # listen
  fn.listen = (list) ->

    if $.type(list) != 'array' then list = [list]

    for a in list
      if ~a.search /\.coffee/ then fn.listen.coffee a
      else if ~a.search /\.styl/ then fn.listen.stylus a
      else if ~a.search /\.yml/ then fn.listen.yaml a
      else $.i 'task.watch.listen type error'

  fn.path = (src) ->
    arr = src.split '/'
    arr.pop()
    arr.join '/'

  fn.listen.coffee = (src) ->
    _src = fn.path src
    _fn = _.debounce ->
      gulp.src src
      .pipe plumber()
      .pipe using()
      .pipe include()
      .pipe _coffee()
      .pipe gulp.dest _src
    , 1e3
    watch "#{_src}/include/**/*.coffee", -> _fn()

  fn.listen.stylus = (src) ->
    _src = fn.path src
    _fn = _.debounce ->
      gulp.src src
      .pipe plumber()
      .pipe using()
      .pipe _stylus()
      .pipe gulp.dest _src
    , 1e3
    watch "#{_src}/include/**/*.styl", -> _fn()

  fn.listen.yaml = (src) ->
    _src = fn.path src
    _fn = _.debounce ->
      gulp.src src
      .pipe plumber()
      .pipe using()
      .pipe _yaml()
      .pipe gulp.dest _src
    , 1e3
    watch "#{_src}/**/*.yml", -> _fn()

  fn.reload = ->
    reload.listen()
    watch "#{path.source}/**/*.css"
    .pipe reload()

  switch project.name
    when 'tamako'
      fn.listen "#{path.source}/style/core.styl"
      fn.listen "#{path.source}/script/core.coffee"
      fn.listen "#{path.source}/script/require/shell-application.coffee"
      fn.listen "#{path.source}/script/require/shell-electron.coffee"
      fn.reload()
    when 'doremi'
      fn.listen "#{path.secret}/*.yml"
      fn.listen "#{path.source}/static/core/style/core.styl"
      fn.listen "#{path.source}/static/core/script/core.coffee"
      fn.reload()
    else $.info 'error', "This project has no 'watch' task"

# build
$.task 'build', (callback) ->

  # function
  fn = {}

  # prepare
  fn.prepare = (cb) ->
    del path.build,
      force: true
    .then -> $.next 200, ->
      $.info 'mkdir', path.build
      fs.mkdirSync path.build
      cb?()

  # each
  fn.each = (map, cb) ->

    # list
    list = (key for key of map)
    i = 0

    # next
    next = ->
      i++
      step()

    # step
    do step = ->
      key = list[i]
      value = map[key]
      isFinish = i > list.length - 1

      $.divide()
      $.info 'step', "Running step '#{if isFinish then 'callback' else key}' ..."
      
      if isFinish
        cb?()
        return

      fn[key].apply fn, if value then [value, next] else [next]

  # copy
  fn.copy = (src, cb) ->
    gulp.src src, base: path.source
    .pipe plumber()
    .pipe using()
    .pipe gulp.dest path.build
    .on 'end', -> cb?()

  # other
  fn.other = (_args...) ->
    [map, cb] = switch _args.length
      when 1 then [[], _args[0]]
      when 2 then _args

    list = map.concat _.clone fn.other._default
    list = _.uniq list, true
    list = ("#{path.source}/**/*.#{a}" for a in list)

    fn.copy list, -> cb?()
  fn.other._default = ['png', 'jpg', 'gif', 'json', 'ttf']

  # yaml
  fn.yaml = (cb) ->
    src = "#{path.secret}/**/*.yml"
    gulp.src src, base: path.secret
    .pipe plumber()
    .pipe using()
    .pipe _yaml()
    .pipe gulp.dest path.secret
    .on 'end', -> cb?()

  # stylus
  fn.stylus = (cb) ->
    src = "#{path.source}/**/*.styl"
    gulp.src src, base: path.source
    .pipe plumber()
    .pipe ignore '**/include/**'
    .pipe using()
    .pipe _stylus()
    .pipe gulp.dest path.build
    .on 'end', -> cb?()

  # css
  fn.css = (cb) ->
    # *.css
    src = "#{path.source}/**/*.css"
    gulp.src src, base: path.source
    .pipe plumber()
    .pipe ignore '**/include/**'
    .pipe ignore '**/*.min.css'
    .pipe using()
    .pipe _minCss()
    .pipe gulp.dest path.build
    .on 'end', ->
      # *.min.css
      _src = "#{path.source}/**/*.min.css"
      fn.copy _src, -> cb?()

  # coffee
  fn.coffee = (cb) ->
    src = "#{path.source}/**/*.coffee"
    gulp.src src, base: path.source
    .pipe plumber()
    .pipe ignore '**/include/**'
    .pipe using()
    .pipe include()
    .pipe _coffee()
    .pipe _uglify()
    .pipe gulp.dest path.build
    .on 'end', -> cb?()

  # js
  fn.js = (cb) ->
    # *.js
    src = "#{path.source}/**/*.js"
    gulp.src src, base: path.source
    .pipe plumber()
    .pipe ignore '**/include/**'
    .pipe ignore '**/*.min.js'
    .pipe using()
    .pipe _uglify()
    .pipe gulp.dest path.build
    .on 'end', ->
      # *.min.js
      _src = "#{path.source}/**/*.min.js"
      fn.copy _src, -> cb?()

  # jade
  fn.jade = (cb) ->
    src = "#{path.source}/**/*.jade"
    gulp.src src, base: path.source
    .pipe plumber()
    .pipe ignore '**/include/**'
    .pipe using()
    .pipe _jade()
    .pipe gulp.dest path.build
    .on 'end', -> cb?()

  # clean
  fn.clean = (_args...) ->
    if _args.length != 2 then return
    [list, cb] = _args
    if !list.length then return

    del list,
      force: true
    .then ->
      $.info 'clean', (a for a in list).join ', '
      cb?()

  # check project
  switch project.name
    when 'tamako'

      # index
      fn._index = (cb) ->

        # check shell
        if argv.shell == 'browser'
          cb?()
          return

        # application below
        # /index.jade
        gulp.src "#{path.source}/index.jade", base: path.source
        .pipe plumber()
        .pipe using()
        .pipe replace /- var shell = 'browser'/, '- var shell = \'application\''
        .pipe _jade()
        .pipe gulp.dest path.build
        .on 'end', -> cb?()

      # version
      fn._version = (cb) ->
        # ./version.md
        gulp.src 'version.md'
        .pipe plumber()
        .pipe using()
        .pipe replace /.*/, (string) ->
          ver = _.trim(string).split ':'
          ver[1] = 1 + parseInt ver[1]
          $.info 'version', "build as #{ver[0]}:#{ver[1]}"
          "#{ver[0]}:#{ver[1]}"
        .pipe gulp.dest ''
        .on 'end', -> cb?()

      fn.each
        prepare: null
        other: null
        css: null
        stylus: null
        js: null
        coffee: null
        jade: null
        _index: null
        clean: do ->
          list = [
            "#{path.build}/style/icon/icon.json"
          ]

          # check shell
          if argv.shell == 'browser' then return list

          # return
          list.concat [
            'platforms/android/assets/www'
            "#{path.build}/style/image/res"
          ]
        _version: null
      , -> callback?()

    when 'doremi'

      salt = Math.random().toString(36).substr 2

      # core
      fn._core = (cb) ->
        src = "#{path.source}/static/core/script/core.coffee"
        gulp.src src, base: path.source
        .pipe plumber()
        .pipe using()
        .pipe replace /app\.salt = '\w*?'/, "app.salt = '#{salt}'"
        .pipe include()
        .pipe _coffee()
        .pipe _uglify()
        .pipe gulp.dest path.build
        .on 'end', -> cb?()

      # folder
      fn._folder = (cb) ->
        list = "#{path.build}/{module,route,view,static}"
        gulp.src "#{list}/**/*.*"
        .pipe plumber()
        .pipe using()
        .pipe gulp.dest "#{path.build}/source"
        .on 'end', ->
          del list,
            force: true
          .then -> cb?()

      # app
      fn._app = (cb) ->
        src = "#{path.build}/app.js"
        gulp.src src
        .pipe plumber()
        .pipe using()
        .pipe gulp.dest "#{path.build}/source"
        .on 'end', ->
          del src,
            force: true
          .then -> cb?()

      # package
      fn._package = (cb) ->
        gulp.src 'package.json'
        .pipe plumber()
        .pipe using()
        .pipe replace /"start": ".*/, "\"start\": \"export NODE_ENV=production&&nodemon source/app.js --delay 10 --ignore '*.json'\"" # commond start
        .pipe replace /"gulp.*?,/g, '' # clear gulp lines
        .pipe replace /"electron.*?,/g, '' # clear electron lines
        .pipe replace /"asar.*?,/g, '' # clear asar lines
        .pipe replace /"blueimp-md5".*?,/, '' # clear blueimp-md5
        .pipe replace /"cheerio".*?,/, '' # clear cheerio
        .pipe replace /"coffee-script".*?,/, '' # clear coffee-script
        .pipe replace /"del".*?,/, '' # clear del
        .pipe replace /"mysql".*?,/, '' # clear mysql
        .pipe replace /"node-json-db".*?,/, '' # clear node-json-db
        .pipe gulp.dest path.build
        .on 'end', -> cb?()

      # secret
      fn._secret = (cb) ->
        gulp.src "#{path.secret}/config.yml"
        .pipe plumber()
        .pipe using()
        .pipe replace /api: '\S+'/, 'api: "https://app.anitama.net/"'
        .pipe replace /salt: \w+/, "salt: \"#{salt}\""
        .pipe _yaml()
        .pipe gulp.dest "#{path.build}/secret"
        .on 'end', -> cb?()

      # each
      fn.each
        prepare: null
        other: fn.other._default.concat 'jade'
        css: null
        stylus: null
        js: null
        coffee: null
        #jade: null
        clean: [
          "#{path.build}/static/core/style/icon/icon.ttf"
          "#{path.build}/static/core/style/icon/icon.json"
        ]
        #version: null
        _core: null
        _folder: null
        _app: null
        _package: null
        _secret: null
      , -> callback?()

    else $.info 'error', "This project has no 'build' task"

# lint
$.task 'lint', ->
  fn = {}

  # coffee lint
  fn.coffee = (cb) ->
    gulp.src path.coffee
    .pipe plumber()
    .pipe using()
    .pipe coffeelint()
    .pipe coffeelint.reporter()
    .on 'end', -> cb?()

  # execute
  fn.coffee()

# prepare
$.task 'prepare', ->
  fn = {}
  switch project.name
    when 'kokoro'

      # gulpfile
      fn.gulpfile = (cb) ->
        gulp.src './gulpfile.coffee'
        .pipe plumber()
        .pipe using()
        .pipe _coffee()
        .pipe gulp.dest ''
        .on 'end', -> cb?()

      # coffeelint
      fn.coffeelint = (cb) ->
        gulp.src './coffeelint.yml'
        .pipe plumber()
        .pipe using()
        .pipe _yaml()
        .pipe gulp.dest ''
        .on 'end', -> cb?()

      # execute
      fn.gulpfile -> fn.coffeelint()

    when 'tamako'

      # coffee
      fn.coffee = (cb) ->
        gulp.src "#{path.source}/**/*.coffee", base: path.source
        .pipe plumber()
        .pipe ignore '**/gurumin/**'
        .pipe ignore '**/include/**'
        .pipe using()
        .pipe include()
        .pipe _coffee()
        .pipe gulp.dest path.source
        .on 'end', -> cb?()

      # stylus
      fn.stylus = (cb) ->
        gulp.src "#{path.source}/**/*.styl", base: path.source
        .pipe plumber()
        .pipe ignore '**/gurumin/**'
        .pipe ignore '**/include/**'
        .pipe using()
        .pipe _stylus()
        .pipe gulp.dest path.source
        .on 'end', -> cb?()

      # jade
      fn.jade = (cb) ->
        gulp.src "#{path.source}/**/*.jade", base: path.source
        .pipe plumber()
        .pipe ignore '**/gurumin/**'
        .pipe ignore '**/include/**'
        .pipe using()
        .pipe _jade()
        .pipe gulp.dest path.source
        .on 'end', -> cb?()

      # execute
      fn.coffee -> fn.stylus -> fn.jade()

    when 'doremi'

      # ymal
      fn.yaml = (cb) ->
        gulp.src "secret/config.yml"
        .pipe plumber()
        .pipe using()
        .pipe include()
        .pipe _yaml()
        .pipe gulp.dest 'secret'
        .on 'end', -> cb?()

      # coffee
      fn.coffee = (cb) ->
        gulp.src "#{path.source}/**/*.coffee", base: path.source
        .pipe plumber()
        .pipe ignore '**/gurumin/**'
        .pipe ignore '**/include/**'
        .pipe using()
        .pipe include()
        .pipe _coffee()
        .pipe gulp.dest path.source
        .on 'end', -> cb?()

      # stylus
      fn.stylus = (cb) ->
        gulp.src "#{path.source}/**/*.styl", base: path.source
        .pipe plumber()
        .pipe ignore '**/gurumin/**'
        .pipe ignore '**/include/**'
        .pipe using()
        .pipe _stylus()
        .pipe gulp.dest path.source
        .on 'end', -> cb?()

      # execute
      fn.yaml -> fn.coffee -> fn.stylus()

    else $.info 'error', "This project has no 'prepare' task"

# nodemon
$.task 'nodemon', ->
  switch project.name
    when 'doremi' then $.shell 'nodemon --delay 500ms --ignore source/static source/app.js'
    else $.shell 'nodemon index.js --watch _blank'

# work
$.task 'work', ->
  switch project.name
    when 'tamako', 'doremi'
      $.shell 'gulp watch'
      $.shell 'gulp nodemon'
    else $.info 'error', "This project has no 'work' task"

# noop
$.task 'noop', -> null

# test
$.task 'test', ->
  switch project.name
    when 'noop' then _.noop()
    else $.info 'error', "This project has no 'test' task"

# update
$.task 'update', ->
  # param
  isAll = _.size(argv) == 1 or argv.all

  # cordova
  if isAll or argv.cordova
    switch project.name
      
      when 'tamako'
        del '{platforms,plugins}',
          force: true
        .then ->
          $.info 'clean', 'platforms, plugins'
          $.shell "cordova platform add android"
      
      else $.info 'error', "This project has no 'update' task"

# electron
$.task 'package', ->
  switch project.name
    when 'tamako'
      $.task('build') ->

        # target
        target = '../electron'

        # function
        fn = {}

        fn.clean = (cb) ->
          del "#{target}/{bin,output}",
            force: true
          .then ->
            fs.mkdirSync "#{target}/bin"
            cb?()

        # www.asar
        fn.asar = (cb) ->
          asar = require 'asar'
          asar.createPackage 'www/', "#{target}/bin/www.asar", -> cb?()

        # main.js
        fn.js = (cb) ->
          gulp.src 'main.js'
          .pipe plumber()
          .pipe using()
          .pipe replace /debug\s=\strue/, 'debug = false'
          .pipe gulp.dest "#{target}/bin"
          .on 'end', -> cb?()

        # package.json
        fn.json = (cb) ->
          json =
            name: project.name
            productName: title
            main: 'main.js'
          fs.writeFileSync "#{target}//bin/package.json", JSON.stringify json
          cb?()

        # title
        title = if project.name == 'tamako' then 'Anitama' else 'Shiro'

        # execute
        fn.clean -> fn.json -> fn.js -> fn.asar ->
          $.shell "electron-packager #{target}/bin #{title.toLowerCase()} --all --version=1.2.2 --out=#{target}/output --overwrite"

    else $.info 'error', "This project has no 'package' task"

# set
$.task 'set', ->
  if argv.version
    switch project.name
      when 'tamako'

        # version
        ver = [
          argv.version
          $.trim(fs.readFileSync 'version.md').replace /.*:/, ''
        ]

        # function
        fn = {}

        # config.xml
        fn.xml = (cb) ->

          _name = switch project.name
            when 'tamako' then 'Anitama'
            else 'Unknown'

          gulp.src 'config.xml'
          .pipe plumber()
          .pipe using()
          .pipe replace /android-versionCode=".*?"/, "android-versionCode=\"#{ver[1]}\""
          .pipe replace /version=".*?" xmlns/, "version=\"#{ver[0]}\" xmlns"
          .pipe replace new RegExp("value=\"#{_name}\/.*?\""), "value=\"#{_name}/#{ver[0]}\""
          .pipe gulp.dest ''
          .on 'end', -> cb?()

        # version.md
        fn.md = (cb) ->
          gulp.src 'version.md'
          .pipe plumber()
          .pipe using()
          .pipe replace /.*/, "#{ver[0]}:#{ver[1]}"
          .pipe gulp.dest ''
          .on 'end', -> cb?()

        # execute
        fn.xml -> fn.md()

      else $.info 'error', "This project has no 'set' task"

# release
$.task 'release', ->
  switch project.name
    when 'kuro'
      ssh = new require('gulp-ssh')
        sshConfig:
          host: 'uiluv.com'
          port: 7561
          username: 'root'
          privateKey: fs.readFileSync 'C:/Users/御御子/.ssh/id_rsa_uiluv'
      _path = '/project/kuro'

      # function
      fn = {}

      fn.prepare = (cb) ->
        ssh.shell [
          'cd ' + _path
          'rm package.json'
          'rm -rf source'
        ]
        .pipe gulp.dest 'log'
        .on 'end', -> cb?()

      fn.upload = (cb) ->
        gulp.src path.build + '/**/*.*'
        .pipe plumber()
        .pipe ssh.dest _path
        .on 'end', -> cb?()

      fn.install = (cb) ->
        ssh.shell [
          'npm install'
        ]
        .pipe gulp.dest 'log'
        .on 'end', -> cb?()

      # execute
      if _.size(argv) == 1 or argv.prepare
        fn.prepare ->
          $.shell 'gulp release --upload'
      else if argv.upload
        fn.upload ->
          $.shell 'gulp release --install'
      else if argv.install
        fn.install ->
          $.info 'release', 'Released'

    else $.info 'error', "This project has no 'release' task"

# start
$.task 'start', ->
  switch project.name
    when 'tamako'
      $.task('build') -> $.shell 'npm start'
    else $.info 'error', 'This project <start> task'
      
# run
$.task 'run', ->
  switch project.name
    when 'tamako'
      $.task('build') -> $.next 5e3, -> $.shell 'cordova run'
    else $.info 'error', "This project has no 'run' task"