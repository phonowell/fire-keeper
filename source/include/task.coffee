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

  check()
  default()
  gurumin()
  kokoro()
  noop()
  prune()
  update()

###

$$.task 'check', co ->

  listSource = []

  listExt = [
    'coffee'
    'md'
    'pug'
    'styl'
    'yaml'
  ]
  for ext in listExt
    listSource.push "./*.#{ext}"
    listSource.push "./source/**/*.#{ext}"

  listSource = yield $$.source listSource

  for source in listSource

    cont = $.parseString yield $$.read source
    listCont = cont.split '\n'

    if !_.trim(_.last listCont).length
      listCont.pop()
      yield $$.write source, listCont.join('\n')

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

$$.task 'prune', co ->

  yield $$.shell 'npm prune'

  base = './node_modules'

  # file

  listFile = [
    '.DS_Store'
    '.babelrc'
    '.coveralls.yml'
    '.documentup.json'
    '.editorconfig'
    '.eslintignore'
    '.eslintrc'
    '.eslintrc.js'
    '.flowconfig'
    '.gitattributes'
    '.jshintrc'
    '.npmignore'
    '.tern-project'
    '.travis.yml'
    '.yarn-integrity'
    '.yarn-metadata.json'
    '.yarnclean'
    '.yo-rc.json'
    'AUTHORS'
    'CHANGES'
    'CONTRIBUTORS'
    'Gruntfile.js'
    'Gulpfile.js'
    'LICENSE'
    'LICENSE.txt'
    'Makefile'
    '_config.yml'
    'appveyor.yml'
    'circle.yml'
  ]

  listSource = ("#{base}/**/#{line}" for line in listFile)
  yield $$.remove listSource

  # directory

  listDirectory = [
    '.circleci'
    '.github'
    '.idea'
    '.nyc_output'
    '.vscode'
    '__tests__'
    'assets'
    'coverage'
    'doc'
    'docs'
    'example'
    'examples'
    'images'
    'powered-test'
    'test'
    'tests'
    'website'
  ]

  listSource = ("#{base}/**/#{line}" for line in listDirectory)
  yield $$.remove listSource

  # extension

  listExtension = [
    '.coffee'
    '.jst'
    '.md'
    '.swp'
    '.tgz'
    '.ts'
  ]

  listSource = ("#{base}/**/*#{line}" for line in listExtension)
  yield $$.remove listSource

$$.task 'update', co ->

  yield $$.update()
  yield $$.shell 'npm prune'