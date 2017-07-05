# task

$$.task = (arg...) ->
  switch arg.length
    when 1 then gulp.tasks[arg[0]].fn
    when 2 then gulp.task arg...
    else throw _error 'length'

# added fire keeper task

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

  yield $$.remove './source/gurumin'
  yield $$.link './../gurumin/source', './source/gurumin'

$$.task 'kokoro', co ->

# copy

  LIST = [
    '.gitignore'
    '.npmignore'
    'coffeelint.yml'
    'stylintrc.yml'
  ]

  for source in LIST

    yield $$.remove "./#{source}"
    yield $$.copy "./../kokoro/#{source}", './'
    yield $$.shell "git add -f ./#{source}"

  # compile

  yield $$.compile './coffeelint.yml'

  yield $$.compile './stylintrc.yml'
  yield $$.copy './stylintrc.json', './',
    prefix: '.'
    extname: ''
  yield $$.remove './stylintrc.json'

$$.task 'noop', -> null

$$.task 'update', co ->

  pkg = './package.json'
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