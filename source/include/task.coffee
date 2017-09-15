###

  cloneGitHub(name)

###

fetchGitHub = co (name) ->

  source = normalizePath "./../#{name}"

  if yield $$.isExisted source
    return yield $$.shell [
      "cd ./../#{name}"
      'git fetch'
      'git pull'
    ]

  yield $$.shell "git clone
  https://github.com/phonowell/#{name}.git
  #{$$.path.base}/../#{name}"

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

  yield fetchGitHub 'gurumin'

  yield $$.remove './source/gurumin'
  yield $$.link './../gurumin/source', './source/gurumin'

$$.task 'kokoro', co ->

  yield fetchGitHub 'kokoro'

  # clean

  listClean = [
    './.stylintrc'
    './coffeelint.json'
    './coffeelint.yml'
    './stylintrc.yaml'
    './stylintrc.yml'
  ]
  $.info.pause 'kokoro'
  yield $$.remove listClean
  $.info.resume 'kokoro'

  # copy

  LIST = [
    '.gitignore'
    '.npmignore'
    'coffeelint.yaml'
    'license.md'
    'stylint.yaml'
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

$$.task 'noop', -> null
