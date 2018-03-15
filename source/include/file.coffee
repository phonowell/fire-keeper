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

$$.copy = (arg...) ->

  # source, target, [option]
  [source, target, option] = switch arg.length
    when 2 then [arg[0], arg[1], null]
    when 3 then arg
    else throw makeError 'length'

  source = formatPath source
  if target then target = normalizePath target

  await new Promise (resolve) ->

    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe gulpIf !!option, rename option
    .pipe gulp.dest (e) -> target or e.base
    .on 'end', -> resolve()

  msg = "copied #{wrapList source} to #{wrapList target}"
  if option then msg += ", as '#{$.parseString option}'"
  $.info 'copy', msg

  $$ # return

$$.isExisted = (source) ->

  source = formatPath source
  if !source.length then return false

  for src in source
    unless await fse.pathExists src
      return false

  true # return

$$.isSame = (source) ->

  source = formatPath source

  if !source.length
    return false

  # check size

  SIZE = null

  for src in source

    stat = await $$.stat src
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
    cont = await $$.read src
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

$$.link = (source, target) ->

  unless source and target
    throw makeError 'length'

  source = normalizePath source
  target = normalizePath target

  await fse.ensureSymlink source, target

  $.info 'link', "linked #{wrapList source} to #{wrapList target}"

  $$ # return

$$.mkdir = (source) ->

  if !source then throw makeError 'length'

  source = formatPath source

  listPromise = (fse.ensureDir src for src in source)

  await Promise.all listPromise

  $.info 'create', "created #{wrapList source}"

  $$ # return

$$.move = (source, target) ->

  unless source and target
    throw makeError 'length'

  source = formatPath source
  target = normalizePath target

  $.info.pause '$$.move'
  await $$.copy source, target
  await $$.remove source
  $.info.resume '$$.move'

  $.info 'move'
  , "moved #{wrapList source} to '#{target}'"

  $$ # return

$$.read = (source, option = {}) ->

  source = normalizePath source

  unless await $$.isExisted source
    $.info 'file', "#{wrapList source} not existed"
    return null

  res = await new Promise (resolve) ->

    fs.readFile source, (err, data) ->
      if err then throw err
      resolve data

  $.info 'file', "read #{wrapList source}"

  # return

  if option.raw then return res
  
  res = switch path.extname(source)[1...]
    when 'json' then $.parseJSON res
    when 'coffee', 'css', 'html', 'js', 'md', 'pug', 'sh', 'styl', 'txt', 'xml', 'yaml', 'yml'
      $.parseString res
    else res

$$.remove = (source) ->

  listSource = await $$.source source

  for src in listSource
    await new Promise (resolve) ->
      fse.remove src, (err) ->
        if err then throw err
        resolve()

    # $.info 'remove', "removed '#{src}'"
  $.info 'remove', "removed #{wrapList source}"

  $$ # return

$$.rename = (source, option) ->

  source = formatPath source

  listHistory = []

  await new Promise (resolve) ->

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
    if await $$.isExisted item[1]
      await $$.remove item[0]
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

$$.stat = (source) ->

  source = normalizePath source

  unless await $$.isExisted source
    $.info 'file', "#{wrapList source} not existed"
    return null

  # return
  new Promise (resolve) ->

    fs.stat source, (err, stat) ->
      if err then throw err
      resolve stat

$$.write = (source, data, option) ->

  source = normalizePath source

  if $.type(data) in ['array', 'object']
    data = $.parseString data

  await fse.outputFile source, data, option

  $.info 'file', "wrote #{wrapList source}"

  $$ # return