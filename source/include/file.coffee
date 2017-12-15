###

  copy(source, target, [option])
  isChanged(source)
  isExisted(source)
  isSame(source, target)
  link(source, target)
  mkdir(source)
  move(source, target)
  read(source, [option])
  remove(source)
  rename(source, option)
  source(source)
  stat(source)
  write(source, data)

###

$$.copy = co (arg...) ->

  # source, target, [option]
  [source, target, option] = switch arg.length
    when 2 then [arg[0], arg[1], null]
    when 3 then arg
    else throw makeError 'length'

  source = formatPath source
  if target then target = normalizePath target

  yield new Promise (resolve) ->

    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe gulpif !!option, rename option
    .pipe gulp.dest (e) -> target or e.base
    .on 'end', -> resolve()

  msg = "copied #{wrapList source} to #{wrapList target}"
  if option then msg += ", as '#{$.parseString option}'"
  $.info 'copy', msg

  $$ # return

$$.isExisted = co (source) ->

  source = formatPath source
  if !source.length then return false

  for src in source
    unless yield fse.pathExists src
      return false

  true # return

$$.isSame = co (source) ->

  source = formatPath source

  if !source.length
    return false

  # check size

  SIZE = null

  for src in source

    stat = yield $$.stat src
    if !stat
      return false

    {size} = stat

    if !SIZE
      SIZE = size
      continue

    if size != SIZE
      return false

  # check cont

  CONT = null

  for src in source

    $.info.pause '$$.isSame'
    cont = yield $$.read src
    $.info.resume '$$.isSame'
    if !cont
      return false

    cont = $.parseString cont

    if !CONT
      CONT = cont
      continue

    if cont != CONT
      return false

  true # return

$$.link = co (source, target) ->

  unless source and target
    throw makeError 'length'

  source = normalizePath source
  target = normalizePath target

  yield fse.ensureSymlink source, target

  $.info 'link', "linked #{wrapList source} to #{wrapList target}"

  $$ # return

$$.mkdir = co (source) ->

  if !source then throw makeError 'length'

  source = formatPath source

  listPromise = (fse.ensureDir src for src in source)

  yield Promise.all listPromise

  $.info 'create', "created #{wrapList source}"

  $$ # return

$$.move = co (source, target) ->

  unless source and target
    throw makeError 'length'

  source = formatPath source
  target = normalizePath target

  $.info.pause '$$.move'
  yield $$.copy source, target
  yield $$.remove source
  $.info.resume '$$.move'

  $.info 'move'
  , "moved #{wrapList source} to #{target}"

  $$ # return

$$.read = co (source, option = {}) ->

  source = normalizePath source

  unless yield $$.isExisted source
    $.info 'file', "#{wrapList source} not existed"
    return null

  res = yield new Promise (resolve) ->

    fs.readFile source, (err, data) ->
      if err then throw err
      resolve data

  $.info 'file', "read #{wrapList source}"

  # return

  if option.raw then return res
  
  res = switch path.extname(source)[1...]
    when 'json' then $.parseJSON res
    when 'html', 'md', 'txt', 'yaml', 'yml'
      $.parseString res
    else res

$$.remove = co (source) ->

  source = formatPath source

  yield del source, force: true

  $.info 'remove', "removed #{wrapList source}"

  $$ # return

$$.rename = co (source, option) ->

  source = formatPath source

  listHistory = []

  yield new Promise (resolve) ->

    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe rename option
    .pipe gulp.dest (e) ->
      listHistory.push e.history
      e.base
    .on 'end', -> resolve()

  $.info.pause '$$.rename'
  for item in listHistory
    if yield $$.isExisted item[1]
      yield $$.remove item[0]
  $.info.resume '$$.rename'

  $.info 'file'
  , "renamed #{wrapList source} as '#{$.parseString option}'"

  $$ # return

$$.source = (source) ->

  source = formatPath source

  new Promise (resolve) ->

    listSource = []

    gulp.src source, read: false
    .on 'data', (item) -> listSource.push item.path
    .on 'end', -> resolve listSource

$$.stat = co (source) ->

  source = normalizePath source

  unless yield $$.isExisted source
    $.info 'file', "#{wrapList source} not existed"
    return null

  # return
  new Promise (resolve) ->

    fs.stat source, (err, stat) ->
      if err then throw err
      resolve stat

$$.write = co (source, data, option) ->

  source = normalizePath source

  if $.type(data) in ['array', 'object']
    data = $.parseString data

  yield fse.outputFile source, data, option

  $.info 'file', "wrote #{wrapList source}"

  $$ # return