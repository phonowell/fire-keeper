$p = $$.plugin = require('gulp-load-plugins')()

del = $p.del = require 'del'
$p.yargs = require 'yargs'

{
  using
  plumber, ignore, changed
  include, replace, rename
  yaml, pug, markdown, coffee, stylus
  sourcemaps
  htmlmin, cleanCss
  zip
  coffeelint, livereload
} = $p

gulpif = $p.if

uglifyjs = require 'uglify-es'
composer = require 'gulp-uglify/composer'
uglify = $p.uglify = composer uglifyjs, console