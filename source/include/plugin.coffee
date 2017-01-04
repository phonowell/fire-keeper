$p = $$.plugin = require('gulp-load-plugins')()

del = $p.del = require 'del'
$p.yargs = require 'yargs'

{
  using
  plumber, ignore, include, replace
  cleanCss
  coffeelint, livereload
} = $p

gulpif = $p.if

_jade = $p.jade
_coffee = $p.coffee
_stylus = $p.stylus
_yaml = $p.yaml

jade = -> _jade pretty: false
coffee = -> _coffee map: false
stylus = -> _stylus compress: true
yaml = -> _yaml safe: true

_regen = $p.regenerator
regen = -> gulpif $$.config('useGenerator'), _regen()

_uglify = $p.uglify
uglify = -> gulpif !$$.config('useHarmony'), _uglify()