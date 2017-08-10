###

  link(source, target)
  ln(source, target)

###

$$.link = co (source, target) ->

  if !(source and target)
    throw _error 'length'

  source = _normalizePath source
  target = _normalizePath target

  unless yield $$.isExisted source
    throw _error "'#{source}' was invalid"

  isDir = fs.statSync(source).isDirectory()
  type = if isDir then 'dir' else 'file'

  $.info.isSilent = true
  dirname = path.dirname target
  yield $$.mkdir dirname
  $.info.isSilent = false

  yield new Promise (resolve) ->
    fs.symlink source, target, type, (err) ->
      if err then throw err
      if type == 'dir' then type = 'directory'
      resolve()

  $.info 'link', "linked '#{type}' '#{source}' to '#{target}'"

  # return
  $$

$$.ln = $$.link