$p = $$.plugin = require('gulp-load-plugins')()

del = $p.del = require 'del'
$p.yargs = require 'yargs'

{
  using
  plumber, ignore, include, replace
  jade, stylus
  regenerator
  cleanCss, uglify
  coffeelint, livereload
} = $p

gulpif = $p.if

_coffee = $p.coffee
_yaml = $p.yaml

coffee = -> _coffee map: false
yaml = -> _yaml safe: true