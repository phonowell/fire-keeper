###
fetchGitHub_(name)
###

fetchGitHub_ = (name) ->

  source = normalizePath "./../#{name.split('/')[1]}"

  if await $.isExisted_ source
    return await $.shell_ [
      "cd #{source}"
      'git fetch'
      'git pull'
    ]

  await $.shell_ "git clone
  https://github.com/#{name}.git
  #{source}"

###
task(name, [fn])
###

# task

$.task = (arg...) ->

  switch arg.length
    when 1 then gulp.tasks[arg[0]].fn
    when 2 then gulp.task arg...
    else throw new Error 'invalid argument length'

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

$.task 'check', ->

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
    listSource.push "./test/**/*.#{ext}"

  listSource = await $.source_ listSource

  for source in listSource

    cont = $.parseString await $.read_ source
    listCont = cont.split '\n'

    if !_.trim(_.last listCont).length
      listCont.pop()
      await $.write_ source, listCont.join('\n')

$.task 'default', ->
  list = (key for key of gulp.tasks)
  list.sort()
  $.info 'task', wrapList list

$.task 'gurumin', ->

  await fetchGitHub_ 'phonowell/gurumin'

  await $.remove_ './source/gurumin'
  await $.link_ './../gurumin/source', './source/gurumin'

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
  ]

  for filename in LIST

    source = "./../kokoro/#{filename}"
    target = "./#{filename}"

    isSame = await $.isSame_ [source, target]
    if isSame == true
      continue

    await $.copy_ source, './'
    await $.shell_ "git add -f #{$.path.base}/#{filename}"

$.task 'noop', -> null

$.task 'prune', ->

  await $.shell_ 'npm prune'

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
    'LICENSE'
    'LICENSE.txt'
    'Makefile'
    '_config.yml'
    'appveyor.yml'
    'circle.yml'
    'eslint'
    'gulpfile.js'
    'htmllint.js'
    'jest.config.js'
    'karma.conf.js'
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
    '.swp'
    '.tgz'
    '.ts'
  ]

  listSource = ("#{base}/**/*#{line}" for line in listExtension)
  await $.remove_ listSource

$.task 'update', ->

  {registry} = $.argv

  await $.update_ {registry}
  await $.shell_ 'npm prune'