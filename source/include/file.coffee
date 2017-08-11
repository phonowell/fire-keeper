###

  isExisted(source)
  read(source)
  rename(source, option)
  write(source, data)

###

$$.isExisted = co (source) ->

  source = _normalizePath source

  res = yield new Promise (resolve) ->

    fs.exists source, (result) -> resolve result

  msg = if res then 'existed' else 'not existed'
  $.info 'file', "'#{source}' #{msg}"

  # return
  res

$$.read = co (source) ->

  source = _normalizePath source

  $.info.isSilent = true
  isExisted = yield $$.isExisted source
  $.info.isSilent = false
  if !isExisted
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

  $.info.isSilent = true
  yield $$.remove source
  $.info.isSilent = false

  $.info 'file'
  , "renamed '#{source}' as '#{$.parseString option}'"

  # return
  $$

$$.write = co (source, data) ->

  source = _normalizePath source

  $.info.isSilent = true
  yield $$.mkdir path.dirname source
  $.info.isSilent = false

  if $.type data in 'array object'.split ' '
    data = $.parseString data

  yield new Promise (resolve) ->

    fs.writeFile source, data, (err) ->
      if err then throw err
      resolve()

  $.info 'file', "wrote '#{source}'"

  # return
  $$