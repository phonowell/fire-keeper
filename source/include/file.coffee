###
copy_(source, target, [option])
isExisted_(source)
isSame_(source, target)
link_(source, target)
mkdir_(source)
move_(source, target)
read_(source, [option])
remove_(source)
rename_(source, option)
stat_(source)
write_(source, data)
###

$.copy_ = (arg...) ->

  # source, target, [option]
  [source, target, option] = switch arg.length
    when 2 then [arg[0], arg[1], null]
    when 3 then arg
    else throw new Error 'invalid argument length'

  source = normalizePathToArray source
  target = normalizePath target

  await new Promise (resolve) ->

    # require
    rename = getPlugin 'gulp-rename'

    gulp.src source,
      allowEmpty: true
    .pipe plumber()
    .pipe using()
    .pipe gulpIf !!option, rename option
    .pipe gulp.dest (e) -> target or e.base
    .on 'end', -> resolve()

  msg = "copied #{wrapList source}
  to #{wrapList target}"
  if option then msg += ", as '#{$.parseString option}'"
  $.info 'copy', msg

  $ # return

$.isExisted_ = (source) ->

  source = normalizePathToArray source
  unless source.length
    return false

  for src in source
    unless await fse.pathExists src
      return false

  true # return

$.isSame_ = (source) ->

  groupSource = normalizePathToArray source
  unless groupSource.length
    return false

  # check size
  cache = null
  for source in groupSource

    stat = await $.stat_ source
    unless stat
      return false

    {size} = stat

    if !cache
      cache = size
      continue

    unless size == cache
      return false

  $.i '+1'

  # check content
  cache = null
  for source in groupSource

    $.info.pause '$.isSame_'
    cont = await $.read_ source
    $.info.resume '$.isSame_'
    
    unless cont
      return false

    cont = $.parseString cont

    if !cache
      cache = cont
      continue

    unless cont == cache
      return false

  true # return

$.link_ = (source, target) ->

  unless source and target
    throw new Error 'invalid argument length'

  source = normalizePath source
  target = normalizePath target

  await fse.ensureSymlink source, target

  $.info 'link', "linked #{wrapList source} to #{wrapList target}"

  $ # return

$.mkdir_ = (source) ->

  if !source then throw new Error 'invalid argument length'

  source = normalizePathToArray source

  listPromise = (fse.ensureDir src for src in source)

  await Promise.all listPromise

  $.info 'create', "created #{wrapList source}"

  $ # return

$.move_ = (source, target) ->

  unless source and target
    throw new Error 'invalid argument length'

  $.info.pause '$.move_'
  await $.copy_ source, target
  await $.remove_ source
  $.info.resume '$.move_'

  $.info 'move'
  , "moved #{wrapList source} to '#{target}'"

  $ # return

$.read_ = (source, option = {}) ->

  source = normalizePath source

  unless await $.isExisted_ source
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
    when 'coffee'
    , 'css'
    , 'html'
    , 'js'
    , 'md'
    , 'pug'
    , 'sh'
    , 'styl'
    , 'txt'
    , 'xml'
      $.parseString res
    when 'json' then $.parseJSON res
    when 'yaml', 'yml'
      # require
      jsYaml = getPlugin 'js-yaml'
      jsYaml.safeLoad res # return
    else res

$.remove_ = (source) ->

  listSource = await $.source_ source

  for src in listSource
    await new Promise (resolve) ->
      fse.remove src, (err) ->
        if err then throw err
        resolve()

    # $.info 'remove', "removed '#{src}'"
  $.info 'remove', "removed #{wrapList source}"

  $ # return

$.rename_ = (source, option) ->

  source = normalizePathToArray source

  listHistory = []

  await new Promise (resolve) ->

    # require
    rename = getPlugin 'gulp-rename'

    gulp.src source
    .pipe plumber()
    .pipe using()
    .pipe rename option
    .pipe gulp.dest (e) ->
      listHistory.push e.history
      e.base
    .on 'end', -> resolve()

  $.info.pause '$.rename_'
  for item in listHistory
    if await $.isExisted_ item[1]
      await $.remove_ item[0]
  $.info.resume '$.rename_'

  $.info 'file'
  , "renamed #{wrapList source} as '#{$.parseString option}'"

  $ # return

$.stat_ = (source) ->

  source = normalizePath source

  unless await $.isExisted_ source
    $.info 'file', "#{wrapList source} not existed"
    return null

  # return
  new Promise (resolve) ->

    fs.stat source, (err, stat) ->
      if err then throw err
      resolve stat

$.write_ = (source, data, option) ->

  source = normalizePath source

  if $.type(data) in ['array', 'object']
    data = $.parseString data

  await fse.outputFile source, data, option

  $.info 'file', "wrote #{wrapList source}"

  $ # return