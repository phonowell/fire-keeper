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

  yield $$.remove "#{$$.base}/source/gurumin"
  yield $$.link './../gurumin/source', "#{$$.base}/source/gurumin"

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

    yield $$.remove "#{$$.base}/#{source}"
    yield $$.copy "#{$$.base}/../kokoro/#{source}", "#{$$.base}/"
    yield $$.shell "git add -f #{$$.base}/#{source}"

  # compile

  yield $$.compile "#{$$.base}/coffeelint.yaml"

  yield $$.compile "#{$$.base}/stylintrc.yaml"
  yield $$.copy "#{$$.base}/stylintrc.json", "#{$$.base}/",
    prefix: '.'
    extname: ''
  yield $$.remove "#{$$.base}/stylintrc.json"

$$.task 'noop', -> null

$$.task 'update', co ->

  npm = switch $$.os
    when 'linux', 'macos' then 'npm'
    when 'windows' then 'cnpm'
    else throw new Error 'invalid os'

  {target} = $$.argv

  pkg = "#{$$.base}/package.json"
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

  yield $$.shell list

  yield $$.remove "#{pkg}.bak"