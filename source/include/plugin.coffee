$p = $$.plugin = require('gulp-load-plugins')()

download = $p.download = require 'download'
walk = $p.walk = require 'klaw'
$p.yargs = require 'yargs'

{
  changed
  cleanCss
  coffee
  coffeelint
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

markdownlint = $p.markdownlint = require 'markdownlint'