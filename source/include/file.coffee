###

  isChanged(source)
  isExisted(source)
  isSame(source, target)
  read(source)
  rename(source, option)
  stat(source)
  write(source, data)

###

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

$$.isExisted = (source) ->

  source = _normalizePath source
  if !source then return false

  new Promise (resolve) ->

    fs.exists source, (result) -> resolve result

$$.isSame = co (source, target) ->

  md5 = require 'blueimp-md5'

  source = _normalizePath source
  target = _normalizePath target

  unless source and target
    return false

  $.info.pause '$$.isSame'
  contSource = yield $$.read source
  contTarget = yield $$.read target
  $.info.resume '$$.isSame'

  unless contSource and contTarget
    return false

  md5Source = md5 contSource.toString()
  md5Target = md5 contTarget.toString()

  # return
  md5Source == md5Target

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

$$.write = co (source, data) ->

  source = _normalizePath source

  $.info.pause '$$.write'
  yield $$.mkdir path.dirname source
  $.info.resume '$$.write'

  if $.type data in 'array object'.split ' '
    data = $.parseString data

  yield new Promise (resolve) ->

    fs.writeFile source, data, (err) ->
      if err then throw err
      resolve()

  $.info 'file', "wrote '#{source}'"

  # return
  $$