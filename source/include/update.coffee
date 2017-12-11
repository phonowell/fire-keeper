###

  update()

###

do ->

  # function

  ###

    addCmd(list, data, isDev, option)
    clean()
    getLatestVersion(name, option)

  ###

  addCmd = co (list, data, isDev, option) ->

    {registry} = option

    for name, version of data

      current = version
      .replace /[~^]/, ''

      $.info.pause '$$.update'
      latest = yield getLatestVersion name, option
      $.info.resume '$$.update'

      if current == latest
        $.info 'update'
        , "'#{name}': '#{current}' == '#{latest}'"
        continue
      $.info 'update'
      , "'#{name}': '#{current}' -> '#{latest}'"

      cmd = []
      cmd.push 'npm install'
      cmd.push "#{name}@#{latest}"
      if registry
        cmd.push "--registry #{registry}"
      cmd.push if isDev
        '--save-dev'
      else '--save'

      list.push cmd.join ' '

  clean = co ->

    yield $$.remove './temp/update'

    listFile = yield $$.source './temp/**/*.*'

    if !listFile.length
      yield $$.remove './temp'

  getLatestVersion = co (name, option) ->

    {registry} = option
    registry or= 'http://registry.npmjs.org'

    source = "./temp/update/#{name}.json"

    unless yield $$.isExisted source
      url = "#{registry}/#{name}/latest?salt=#{_.now()}"
      yield $$.download url
      , './temp/update'
      , "#{name}.json"

    unless data = yield $$.read source
      throw makeError 'source'

    # return
    data.version

  #
  
  fn = co (option) ->

    pkg = yield $$.read './package.json'

    listCmd = []
    yield addCmd listCmd, pkg.dependencies, false, option
    yield addCmd listCmd, pkg.devDependencies, true, option
    
    $.info.pause '$$.update'
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