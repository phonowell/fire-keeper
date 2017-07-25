$p = $$.plugin = require('gulp-load-plugins')()

del = $p.del = require 'del'
$p.yargs = require 'yargs'

{
  changed
  cleanCss
  coffee
  coffeelint
  download
  htmlmin
  ignore
  include
  livereload
  markdown
  plumber
  pug
  rename
  replace
  stylint
  stylus
  sourcemaps
  unzip
  using
  yaml
  zip
} = $p

gulpif = $p.if

uglifyjs = require 'uglify-es'
composer = require 'gulp-uglify/composer'
uglify = $p.uglify = composer uglifyjs, console