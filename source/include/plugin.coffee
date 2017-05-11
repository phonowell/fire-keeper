$p = $$.plugin = require('gulp-load-plugins')()

del = $p.del = require 'del'
$p.yargs = require 'yargs'

{
  using
  plumber, ignore, changed
  include, replace, rename
  yaml, pug, jade, markdown, coffee, stylus
  sourcemaps, regenerator
  htmlmin, cleanCss
  zip
  coffeelint, livereload
} = $p

gulpif = $p.if

uglifyjs = require 'uglify-js-harmony'
uglifyMinifier = require 'gulp-uglify/minifier'
uglify = $p.uglify = -> uglifyMinifier {}, uglifyjs