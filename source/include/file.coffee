###

  copy(source, target, [option])
  isChanged(source)
  isExisted(source)
  isSame(source, target)
  link(source, target)
  mkdir(source)
  read(source)
  remove(source)
  rename(source, option)
  stat(source)
  write(source, data)

###

$$.copy = co (arg...) ->

  # source, target, [option]
  [source, target, option] = switch arg.length
    when 2 then [arg[0], arg[1], null]
    when 3 then arg
    else throw _error 'length'

  source = _formatPath source
  if target then target = _normalizePath target

  yield new Promise (resolve) ->

    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe gulpif !!option, rename option
    .pipe gulp.dest (e) -> target or e.base
    .on 'end', -> resolve()

  msg = "copied '#{source}' to '#{target}'"
  if option then msg += ", as '#{$.parseString option}'"
  $.info 'copy', msg

  # return
  $$

$$.isChanged = co (source) ->

  md5 = require 'blueimp-md5'

  source = _normalizePath source
  pathMap = './temp/fire-keeper/map-file-md5.json'

  if !source
    return false

  contSource = yield $$.read source

  if !contSource
    return false

  md5Source = md5 contSource.toString()

  map = yield $$.read pathMap
  map or= {}

  res = md5Source != map[source]

  map[source] = md5Source

  $.info.pause '$$.isChanged'
  yield $$.write pathMap, map
  $.info.resume '$$.isChanged'

  # return
  res

$$.isExisted = co (source) ->

  source = _formatPath source
  if !source.length then return false

  for src in source
    unless yield fse.pathExists src
      return false

  # return
  true

$$.isSame = co (source) ->

  md5 = require 'blueimp-md5'

  source = _formatPath source

  if !source.length
    return false

  TOKEN = null

  for src in source

    cont = yield $$.read src

    if !cont
      return false

    token = md5 cont.toString()

    if !TOKEN
      TOKEN = token
      continue

    if token != TOKEN
      return false

  # return
  true

$$.link = co (source, target) ->

  unless source and target
    throw _error 'length'

  source = _normalizePath source
  target = _normalizePath target

  yield fse.ensureSymlink source, target

  $.info 'link', "linked '#{source}' to '#{target}'"

  # return
  $$

$$.mkdir = co (source) ->

  if !source then throw _error 'length'

  source = _formatPath source

  listPromise = (fse.ensureDir src for src in source)

  yield Promise.all listPromise

  $.info 'create', "created '#{source}'"

  # return
  $$

$$.read = co (source) ->

  source = _normalizePath source

  unless yield $$.isExisted source
    $.info 'file', "'#{source}' not existed"
    return null

  res = yield new Promise (resolve) ->

    fs.readFile source, (err, data) ->
      if err then throw err
      resolve data

  $.info 'file', "read '#{source}'"

  # return
  res = switch path.extname(source)[1...]
    when 'json' then $.parseJson res
    when 'txt' then $.parseString res
    else res

$$.remove = co (source) ->

  source = _formatPath source

  yield del source, force: true

  $.info 'remove', "removed '#{source}'"

  # return
  $$

$$.rename = co (source, option) ->

  source = _formatPath source

  yield new Promise (resolve) ->

    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe rename option
    .pipe gulp.dest (e) -> e.base
    .on 'end', -> resolve()

  $.info.pause '$$.rename'
  yield $$.remove source
  $.info.resume '$$.rename'

  $.info 'file'
  , "renamed '#{source}' as '#{$.parseString option}'"

  # return
  $$

$$.stat = co (source) ->

  source = _normalizePath source

  unless yield $$.isExisted source
    $.info 'file', "'#{source}' not existed"
    return null

  # return
  new Promise (resolve) ->

    fs.stat source, (err, stat) ->
      if err then throw err
      resolve stat

$$.write = co (source, data, option) ->

  source = _normalizePath source

  if $.type(data) in 'array object'.split ' '
    data = $.parseString data

  yield fse.outputFile source, data, option

  $.info 'file', "wrote '#{source}'"

  # return
  $$
