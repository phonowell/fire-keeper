###

  task(name, [fn])

###

# task

$$.task = (arg...) ->
  switch arg.length
    when 1 then gulp.tasks[arg[0]].fn
    when 2 then gulp.task arg...
    else throw _error 'length'

# added default tasks

###

  default()
  gurumin()
  kokoro()
  noop()
  update([target])

###

$$.task 'default', ->
  list = []
  for key of gulp.tasks
    list.push key
  list.sort()
  $.info 'task', ("'#{task}'" for task in list).join ', '

$$.task 'gurumin', co ->

  yield _cloneGitHub 'gurumin'

  yield $$.remove './source/gurumin'
  yield $$.link './../gurumin/source', './source/gurumin'

$$.task 'kokoro', co ->

  yield _cloneGitHub 'kokoro'

  # clean

  LIST = [
    'coffeelint.yml'
    'stylintrc.yml'
  ]

  yield $$.remove LIST

  # copy

  LIST = [
    '.gitignore'
    '.npmignore'
    'coffeelint.yaml'
    'stylintrc.yaml'
    'license.md'
  ]

  for source in LIST

    yield $$.remove "./#{source}"
    yield $$.copy "./../kokoro/#{source}", './'
    yield $$.shell "git add -f #{$$.path.base}/#{source}"

  # compile

  yield $$.compile './coffeelint.yaml'

  yield $$.compile './stylintrc.yaml'
  yield $$.copy './stylintrc.json', './',
    prefix: '.'
    extname: ''
  yield $$.remove './stylintrc.json'

$$.task 'noop', -> null

$$.task 'update', co ->

  yield $$.remove './package-lock.json'

  npm = switch $$.os
    when 'linux', 'macos' then 'npm'
    when 'windows' then 'cnpm'
    else throw new Error 'invalid os'

  {target} = $$.argv

  pkg = './package.json'
  yield $$.backup pkg

  p = yield $$.read pkg
  list = []

  for key of p.devDependencies
    if target then if key != target then continue
    list.push "#{npm} r --save-dev #{key}"
    list.push "#{npm} i --save-dev #{key}"

  for key of p.dependencies
    if target then if key != target then continue
    list.push "#{npm} r --save #{key}"
    list.push "#{npm} i --save #{key}"

  res = yield $$.shell list

  if res
    yield $$.remove "#{pkg}.bak"
  else
    $.info 'update', 'failed'
    yield $$.recover pkg
    yield $$.shell 'npm i'