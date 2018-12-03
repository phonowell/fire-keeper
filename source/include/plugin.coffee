$p = {}

for key in [
  'archiver'
  'download'
  'gulp-changed'
  'gulp-clean-css'
  'gulp-coffee'
  'gulp-coffeelint'
  'gulp-htmlmin'
  'gulp-ignore'
  'gulp-include'
  'gulp-livereload'
  'gulp-markdown'
  'gulp-plumber'
  'gulp-pug'
  'gulp-rename'
  'gulp-sourcemaps'
  'gulp-stylint'
  'gulp-stylus'
  'gulp-unzip'
  'gulp-using'
  'gulp-watch'
  'gulp-yaml'
  'markdownlint'
  'yargs'
]
  name = _.camelCase key.replace /gulp-/, ''
  global[name] = $p[name] = require key

gulpIf = $p.if = require 'gulp-if'

jsYaml = $p.jsYaml = require 'js-yaml'

uglify = $p.uglify = do ->
  uglifyEs = require 'uglify-es'
  composer = require 'gulp-uglify/composer'
  composer uglifyEs, console

walk = $p.walk = require 'klaw'

# return
$.plugin = $p