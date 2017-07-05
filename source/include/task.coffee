# task

$$.task = (arg...) ->
  switch arg.length
    when 1 then gulp.tasks[arg[0]].fn
    when 2 then gulp.task arg...
    else throw _error 'length'

# added default tasks

###

  default
  gurumin
  kokoro
  noop
  update

###

$$.task 'default', ->
  list = []
  for key of gulp.tasks
    list.push key
  list.sort()
  $.info 'task', ("'#{a}'" for a in list).join ', '

$$.task 'gurumin', co ->

  base = process.cwd()

  if !fs.existsSync "#{base}/../gurumin"
    yield $$.shell "git clone
    https://github.com/phonowell/gurumin.git
    #{base}/../gurumin"

  yield $$.remove "#{base}/source/gurumin"
  yield $$.link "#{base}/../gurumin/source", "#{base}/source/gurumin"

$$.task 'kokoro', co ->

  base = process.cwd()

  if !fs.existsSync "#{base}/../kokoro"
    yield $$.shell "git clone
    https://github.com/phonowell/kokoro.git
    #{base}/../kokoro"

  # copy

  LIST = [
    '.gitignore'
    '.npmignore'
    'coffeelint.yml'
    'stylintrc.yml'
    'lisence.md'
  ]

  for source in LIST

    yield $$.remove "#{base}/#{source}"
    yield $$.copy "#{base}/../kokoro/#{source}", './'
    yield $$.shell "git add -f #{base}/#{source}"

  # compile

  yield $$.compile "#{base}/coffeelint.yml"

  yield $$.compile "#{base}/stylintrc.yml"
  yield $$.copy "#{base}/stylintrc.json", "#{base}/",
    prefix: '.'
    extname: ''
  yield $$.remove "#{base}/stylintrc.json"

$$.task 'noop', -> null

$$.task 'update', co ->

  base = process.cwd()

  pkg = "#{base}/package.json"
  yield $$.backup pkg

  p = require pkg
  list = []

  for key of p.devDependencies
    list.push "cnpm r --save-dev #{key}"
    list.push "cnpm i --save-dev #{key}"

  for key of p.dependencies
    list.push "cnpm r --save #{key}"
    list.push "cnpm i --save #{key}"

  yield $$.shell list

  yield $$.remove "#{pkg}.bak"