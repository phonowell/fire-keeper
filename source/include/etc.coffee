$$.divide = -> $.log $$.divide['__string__']
$$.divide['__string__'] = _.trim _.repeat '- ', 16

$$.watch = $p.watch

$$.reload = ->
  livereload.listen()
  $$.watch "#{$$.path.source}/**/*.css"
  .pipe livereload()

$$.copy = co (source, target = './') ->

  if !source then throw new Error ERROR.length

  yield new Promise (resolve) ->
    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe gulp.dest target
    .on 'end', -> resolve()

  $.info 'copy', "copied '#{source}' to '#{target}'"

$$.delete = co (source) ->
  yield del source, force: true
  $.info 'delete'
  , "deleted '#{if $.type(source) == 'array' then source.join "', '" else source}'"
$$.remove = $$.delete

$$.replace = co (args...) ->

  [pathSource, pathTarget, target, replacement] = switch args.length
    when 3 then [args[0], $$.getBase(args[0]), args[1], args[2]]
    when 4 then args
    else throw new Error ERROR.length

  yield new Promise (resolve) ->
    gulp.src pathSource
    .pipe plumber()
    .pipe using()
    .pipe replace target, replacement
    .pipe gulp.dest pathTarget
    .on 'end', -> resolve()

  $.info 'replace'
  , "replaced '#{target}' to '#{replacement}', from '#{pathSource}' to '#{pathTarget}/'"

$$.getBase = (path) ->
  if ~path.search /\*/
    return path.replace /\/\*.*/, ''

  if ~path.search /\//
    arr = path.split '/'
    arr.pop()
    return arr.join '/'

  '' # return

$$.shell = (cmd) -> new Promise (resolve) ->
  $.shell cmd, -> resolve()

$$.makeDirectory = co (path) ->

  if !path then throw new Error ERROR.length

  mkdirp = require 'mkdirp'

  yield new Promise (resolve) ->
    mkdirp path, (err) ->
      if err then throw new Error err
      resolve()

  $.info 'create', "create '#{path}'"

$$.createFolder = $$.makeDirectory

$$.link = co (origin, target) ->

  if !(origin and target)
    throw new Error ERROR.length

  fs = require 'fs'

  if !fs.existsSync origin
    throw new Error "'#{origin}' is invalid"

  isDir = fs.statSync(origin).isDirectory()
  type = if isDir then 'dir' else 'file'

  if $$.os == 'windows'
    origin = "#{$$.base}\\#{origin.replace /^\.\//, ''}"

  yield new Promise (resolve) ->
    fs.symlink origin, target, type, (err) ->
      if err then throw new Error err
      if type == 'dir' then type = 'directory'
      resolve()

  $.info 'link', "linked #{type} '#{origin}' to '#{target}'"

$$.zip = co (args...) ->

  [origin, target, filename] = switch args.length
    when 2 then [args[0], './', args[1]]
    when 3 then args
    else throw new Error ERROR.length

  yield new Promise (resolve) ->
    gulp.src origin
    .pipe plumber()
    .pipe using()
    .pipe zip filename
    .pipe gulp.dest target
    .on 'end', -> resolve()

  $.info 'zip', "zipped '#{origin}' to '#{target}' as '#{filename}'"