$p = {}

for key in [
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
  'gulp-yaml'
  'gulp-zip'
  'gulp-watch'
  'markdownlint'
  'yargs'
]
  name = _.camelCase key.replace /gulp-/, ''
  global[name] = $p[name] = require key

walk = $p.walk = require 'klaw'

gulpIf = $p.if = require 'gulp-if'

uglify = $p.uglify = do ->
  uglifyEs = require 'uglify-es'
  composer = require 'gulp-uglify/composer'
  composer uglifyEs, console

# return
$$.plugin = $p