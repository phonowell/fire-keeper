do ->

  # function

  ###
  addCmd_(list, data, isDev, option)
  clean_()
  execute_(option)
  getLatestVersion_(name, option)
  ###

  addCmd_ = (list, data, isDev, option) ->

    {registry} = option

    for name, version of data

      current = version
      .replace /[~^]/, ''

      $.info.pause '$.update_'
      latest = await getLatestVersion_ name, option
      $.info.resume '$.update_'

      if current == latest
        $.info 'update'
        , "'#{name}': '#{current}' == '#{latest}'"
        continue
      $.info 'update'
      , "'#{name}': '#{current}' #{chalk.green '->'} '#{latest}'"

      list.push [
        'npm install'
        "#{name}@#{latest}"
        if isDev then '' else '--production'
        if registry then "--registry #{registry}" else ''
        if isDev then '--save-dev' else '--save'
      ].join(' ').replace /\s{2,}/g, ' '

  clean_ = ->

    await $.remove_ './temp/update'

    listFile = await $.source_ './temp/**/*.*'

    if !listFile.length
      await $.remove_ './temp'

  execute_ = (option) ->

    pkg = await $.read_ './package.json'

    listCmd = []
    await addCmd_ listCmd, pkg.dependencies, false, option
    await addCmd_ listCmd, pkg.devDependencies, true, option
    
    $.info.pause '$.update_'
    await clean_()
    $.info.resume '$.update_'

    if !listCmd.length
      $.info 'update', 'every thing is ok'
      return

    await $.shell_ listCmd

    $ # return

  getLatestVersion_ = (name, option) ->

    {registry} = option
    registry or= 'http://registry.npmjs.org'

    source = "./temp/update/#{name}.json"

    unless await $.isExisted_ source
      
      url = "#{registry}/#{name}?salt=#{_.now()}"
      await $.download_ url
      , './temp/update'
      , "#{name}.json"

    unless data = await $.read_ source
      throw makeError 'source'

    # return
    _.get data, 'dist-tags.latest'

  # return
  $.update_ = (arg...) -> execute_ arg...