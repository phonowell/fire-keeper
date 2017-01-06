$$.divide = -> $.log $$.divide['__string__']
$$.divide['__string__'] = _.trim _.repeat '- ', 16

$$.watch = $p.watch

$$.reload = ->
  livereload.listen()
  $$.watch "#{$$.path.source}/**/*.css"
  .pipe livereload()

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

$$.copy = co (source, target) ->
  target or= './'
  yield new Promise (resolve) ->
    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe gulp.dest target
    .on 'end', -> resolve()
  $.info 'copy', "copied '#{source}' to '#{target}'"

$$.delete = co (source) ->
  yield del source, force: true
  $.info 'delete', "deleted '#{if $.type(source) == 'array' then source.join "', '" else source}'"

$$.replace = co (args...) ->

  [pathSource, pathTarget, target, replacement] = switch args.length
    when 3 then [args[0], $$.getBase(args[0]), args[1], args[2]]
    when 4 then args
    else throw new Error 'invalid arguments length'

  yield new Promise (resolve) ->
    gulp.src pathSource
    .pipe plumber()
    .pipe using()
    .pipe replace target, replacement
    .pipe gulp.dest pathTarget
    .on 'end', -> resolve()

  $.info 'replace', "replaced '#{target}' to '#{replacement}', from '#{pathSource}' to '#{pathTarget}/'"

$$.getBase = (path) ->
  if ~path.search /\*/
    return path.replace /\/\*.*/, ''

  if ~path.search /\//
    arr = path.split '/'
    arr.pop()
    return arr.join '/'

  ''

$$.shell = (cmd) ->
  new Promise (resolve) ->
    $.shell cmd, -> resolve()

$$.createFolder = (path) ->
  new Promise (resolve) ->
    fs = require 'fs'
    fs.mkdirSync path
    $.info 'create', "create '#{path}'"
    resolve()