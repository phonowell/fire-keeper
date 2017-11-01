###

  cloneGitHub(name)

###

fetchGitHub = co (name) ->

  source = normalizePath "./../#{name.split('/')[1]}"

  if yield $$.isExisted source
    return yield $$.shell [
      "cd #{source}"
      'git fetch'
      'git pull'
    ]

  yield $$.shell "git clone
  https://github.com/#{name}.git
  #{source}"

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
  update()

###

$$.task 'default', ->
  list = (key for key of gulp.tasks)
  list.sort()
  $.info 'task', wrapList list

$$.task 'gurumin', co ->

  yield fetchGitHub 'phonowell/gurumin'

  yield $$.remove './source/gurumin'
  yield $$.link './../gurumin/source', './source/gurumin'

$$.task 'kokoro', co ->

  yield fetchGitHub 'phonowell/kokoro'

  # clean

  listClean = [
    './coffeelint.yaml'
    './coffeelint.yml'
    './stylint.yaml'
    './stylintrc.yml'
  ]
  $.info.pause 'kokoro'
  yield $$.remove listClean
  $.info.resume 'kokoro'

  # copy

  LIST = [
    '.gitignore'
    '.npmignore'
    '.stylintrc'
    'coffeelint.json'
    'license.md'
  ]

  for filename in LIST

    source = "./../kokoro/#{filename}"
    target = "./#{filename}"

    isSame = yield $$.isSame [source, target]
    if isSame == true
      continue

    yield $$.copy source, './'
    yield $$.shell "git add -f #{$$.path.base}/#{filename}"

$$.task 'noop', -> null

$$.task 'update', co ->

  {alias} = $$.argv

  npmCheck = require 'npm-check'

  data = yield npmCheck
    skipUnused: true

  list = data.get 'packages'

  listCmd = []
  for a in list

    packageJson = a.packageJson
    .replace /[~^]/g, ''
    
    if a.isInstalled and a.installed == a.latest == packageJson
      continue

    cmd = []
    cmd.push alias or 'npm'
    cmd.push 'install'
    cmd.push if a.devDependency
      '--save-dev'
    else '--save'
    cmd.push "#{a.moduleName}@#{a.latest}"

    listCmd.push cmd.join ' '

  if !listCmd.length
    return $.info 'update', 'every thing is ok'

  yield $$.shell listCmd
