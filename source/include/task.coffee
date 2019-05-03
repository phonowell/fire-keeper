###
fetchGitHub_(name)
###

fetchGitHub_ = (name) ->

  source = normalizePath "./../#{name.split('/')[1]}"

  if await $.isExisted_ source
    return await $.exec_ [
      "cd #{source}"
      'git fetch'
      'git pull'
    ]

  await $.exec_ "git clone
  https://github.com/#{name}.git
  #{source}"

###
task(name, [fn])
###

# task

$.task = (arg...) ->

  [name, fn] = arg

  mapTask = gulp._registry._tasks

  # get task list
  unless name
    mapResult = {}
    for name of mapTask
      mapResult[name] = mapTask[name].unwrap()
    return mapResult

  # get function via name
  unless fn
    return mapTask[name].unwrap()

  # set new task
  type = $.type fn
  unless type in ['async function', 'function']
    $.info 'warning', "invalid type of '#{name}()': '#{type}'"
  unless type == 'async function'
    # generate a wrapper
    _fn = fn
    fn = ->
      await new Promise (resolve) -> resolve()
      _fn()

  gulp.task name, fn

# added default tasks

###
default()
gurumin()
kokoro()
noop()
prune()
update()
###

$.task 'default', ->
  
  list = _.keys gulp._registry._tasks
  list.sort()
  $.info 'task', wrapList list

  name = await $.prompt_
    id: 'default-gulp'
    type: 'autocomplete'
    list: list
    message: 'task'

  unless name in list
    throw new Error "invalid task '#{name}'"

  await $.task(name)()

  $ # return

$.task 'gurumin', ->

  await fetchGitHub_ 'phonowell/gurumin'

  await $.chain $
  .remove_ './gurumin'
  .copy_ './../gurumin/source/**/*', './gurumin'

  $ # return

$.task 'kokoro', ->

  await fetchGitHub_ 'phonowell/kokoro'

  # clean

  listClean = [
    './coffeelint.yaml'
    './coffeelint.yml'
    './stylint.yaml'
    './stylintrc.yml'
  ]
  $.info.pause 'kokoro'
  await $.remove_ listClean
  $.info.resume 'kokoro'

  # copy

  LIST = [
    '.gitignore'
    '.npmignore'
    '.stylintrc'
    'coffeelint.json'
    'license.md'
    'tslint.json'
  ]

  for filename in LIST

    source = "./../kokoro/#{filename}"
    target = "./#{filename}"

    isSame = await $.isSame_ [source, target]
    if isSame == true
      continue

    await $.copy_ source, './'
    await $.exec_ "git add -f #{$.path.base}/#{filename}"

  $ # return

$.task 'noop', -> null

# https://github.com/tj/node-prune
$.task 'prune', ->

  # await $.exec_ 'npm prune'

  base = './node_modules'

  # file

  listFile = [
    '.DS_Store'
    '.appveyor.yml'
    '.babelrc'
    '.coveralls.yml'
    '.documentup.json'
    '.editorconfig'
    '.eslintignore'
    '.eslintrc'
    '.eslintrc.js'
    '.eslintrc.json'
    '.eslintrc.yml'
    '.flowconfig'
    '.gitattributes'
    '.gitlab-ci.yml'
    '.htmllintrc'
    '.jshintrc'
    '.lint'
    '.npmignore'
    '.stylelintrc'
    '.stylelintrc.js'
    '.stylelintrc.json'
    '.stylelintrc.yaml'
    '.stylelintrc.yml'
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
    'LICENCE'
    'LICENCE-MIT'
    'LICENCE.BSD'
    'LICENCE.txt'
    'LICENSE'
    'LICENSE-MIT'
    'LICENSE.BSD'
    'LICENSE.txt'
    'Makefile'
    '_config.yml'
    'appveyor.yml'
    'changelog'
    'circle.yml'
    'eslint'
    'gulpfile.js'
    'htmllint.js'
    'jest.config.js'
    'karma.conf.js'
    'licence'
    'license'
    'stylelint.config.js'
    'tsconfig.json'
  ]

  listSource = ("#{base}/**/#{line}" for line in listFile)
  await $.remove_ listSource

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
  await $.remove_ listSource

  # extension

  listExtension = [
    '.coffee'
    '.jst'
    '.markdown'
    '.md'
    '.mkd'
    '.swp'
    '.tgz'
    '.ts'
  ]

  listSource = ("#{base}/**/*#{line}" for line in listExtension)
  await $.remove_ listSource

  $ # return

$.task 'update', ->

  {registry} = $.argv

  await $.update_ {registry}

  $ # return