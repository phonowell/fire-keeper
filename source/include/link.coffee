$$.link = co (origin, target) ->

  if !(origin and target)
    throw new Error ERROR.length

  origin = path.normalize origin
  target = path.normalize target

  if !fs.existsSync origin
    throw new Error "'#{origin}' is invalid"

  isDir = fs.statSync(origin).isDirectory()
  type = if isDir then 'dir' else 'file'

  if $$.os in ['windows', 'linux']
    origin = path.normalize "#{$$.base}#{path.sep}#{origin}"

  yield new Promise (resolve) ->
    fs.symlink origin, target, type, (err) ->
      if err then throw new Error err
      if type == 'dir' then type = 'directory'
      resolve()

  $.info 'link', "linked #{type} '#{origin}' to '#{target}'"

$$.ln = $$.link