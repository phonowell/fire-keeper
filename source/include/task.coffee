###

  task(name, [fn])

###

# task

$$.task = (arg...) ->

  switch arg.length
    when 1 then gulp.tasks[arg[0]].fn
    when 2 then gulp.task arg...
    else throw makeError 'length'

# added default tasks

###

  default()
  gurumin()
  kokoro()
  noop()

###

$$.task 'default', ->
  list = (key for key of gulp.tasks)
  list.sort()
  $.info 'task', wrapList list

$$.task 'gurumin', co ->

  yield cloneGitHub 'gurumin'

  yield $$.remove './source/gurumin'
  yield $$.link './../gurumin/source', './source/gurumin'

$$.task 'kokoro', co ->

  yield cloneGitHub 'kokoro'

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

  for filename in LIST

    source = "./../kokoro/#{filename}"
    target = "./#{filename}"

    isSame = yield $$.isSame [source, target]
    if isSame == true
      continue

    yield $$.remove target
    yield $$.copy source, './'
    yield $$.shell "git add -f #{$$.path.base}/#{filename}"

  # compile

  yield $$.compile './coffeelint.yaml'

  yield $$.compile './stylintrc.yaml'
  yield $$.copy './stylintrc.json', './',
    prefix: '.'
    extname: ''
  yield $$.remove './stylintrc.json'

$$.task 'noop', -> null
