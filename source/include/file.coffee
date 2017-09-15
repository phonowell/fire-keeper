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

  msg = "copied #{wrapList source} to #{wrapList  target}"
  if option then msg += ", as '#{$.parseString option}'"
  $.info 'copy', msg

  # return
  $$

$$.isExisted = co (source) ->

  source = formatPath source
  if !source.length then return false

  for src in source
    unless yield fse.pathExists src
      return false

  # return
  true

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

  # return
  true

$$.link = co (source, target) ->

  unless source and target
    throw makeError 'length'

  source = normalizePath source
  target = normalizePath target

  yield fse.ensureSymlink source, target

  $.info 'link', "linked #{wrapList source} to #{wrapList target}"

  # return
  $$

$$.mkdir = co (source) ->

  if !source then throw makeError 'length'

  source = formatPath source

  listPromise = (fse.ensureDir src for src in source)

  yield Promise.all listPromise

  $.info 'create', "created #{wrapList source}"

  # return
  $$

$$.read = co (source) ->

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
  res = switch path.extname(source)[1...]
    when 'json' then $.parseJson res
    when 'txt' then $.parseString res
    else res

$$.remove = co (source) ->

  source = formatPath source

  yield del source, force: true

  $.info 'remove', "removed #{wrapList source}"

  # return
  $$

$$.rename = co (source, option) ->

  source = formatPath source

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
  , "renamed #{wrapList source} as '#{$.parseString option}'"

  # return
  $$

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

  # return
  $$
