###

  update()

###

do ->

  REGISTRY = 'https://registry.npm.taobao.org'

  # function

  ###

    addCmdLines(list, type, data)
    clean()
    getLatestVersion(name)

  ###

  addCmdLines = co (list, data, isDev) ->

    for name, version of data

      current = version
      .replace /[~^]/, ''

      unless latest = yield getLatestVersion name
        continue

      if current == latest
        continue

      cmd = ['npm install']
      cmd.push "#{name}@#{latest}"
      cmd.push "--registry #{REGISTRY}"
      cmd.push if isDev
        '--save-dev'
      else '--save'

      list.push cmd.join ' '

  clean = co ->

    yield $$.remove './temp/update'

    listFile = yield $$.source './temp/**/*.*'

    if !listFile.length
      yield $$.remove './temp'

  getLatestVersion = co (name) ->

    source = "./temp/update/#{name}.json"

    unless yield $$.isExisted source
      url = "#{REGISTRY}/#{name}/latest"
      try yield $$.download url
      , './temp/update'
      , "#{name}.json"

    data = yield $$.read source

    # return
    
    if !data then return null

    data.version

  #
  
  fn = co ->

    pkg = yield $$.read './package.json'

    listCmd = []
    $.info.pause '$$.update'
    yield addCmdLines listCmd, pkg.dependencies
    yield addCmdLines listCmd, pkg.devDependencies, true
    yield clean()
    $.info.resume '$$.update'

    if !listCmd.length
      $.info 'update', 'every thing is ok'
      return

    yield $$.shell listCmd

    # return
    $$

  # return
  $$.update = fn