###

  isExisted(source)
  read(source)
  rename(source, option)
  stat(source)
  write(source, data)

###

$$.isExisted = (source) ->

  source = _normalizePath source

  new Promise (resolve) ->

    fs.exists source, (result) -> resolve result

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