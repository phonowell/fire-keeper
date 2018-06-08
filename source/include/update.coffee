do ->

  # function

  ###
  addCmd(list, data, isDev, option)
  clean()
  execute(option)
  getLatestVersion(name, option)
  ###

  addCmd = (list, data, isDev, option) ->

    {registry} = option

    for name, version of data

      current = version
      .replace /[~^]/, ''

      $.info.pause '$.update'
      latest = await getLatestVersion name, option
      $.info.resume '$.update'

      if current == latest
        $.info 'update'
        , "'#{name}': '#{current}' == '#{latest}'"
        continue
      $.info 'update'
      , "'#{name}': '#{current}' #{colors.green '->'} '#{latest}'"

      list.push [
        'npm install'
        "#{name}@#{latest}"
        if isDev then '' else '--production'
        if registry then "--registry #{registry}" else ''
        if isDev then '--save-dev' else '--save'
      ].join(' ').replace /\s{2,}/g, ' '

  clean = ->

    await $.remove './temp/update'

    listFile = await $.source './temp/**/*.*'

    if !listFile.length
      await $.remove './temp'

  execute = (option) ->

    pkg = await $.read './package.json'

    listCmd = []
    await addCmd listCmd, pkg.dependencies, false, option
    await addCmd listCmd, pkg.devDependencies, true, option
    
    $.info.pause '$.update'
    await clean()
    $.info.resume '$.update'

    if !listCmd.length
      $.info 'update', 'every thing is ok'
      return

    await $.shell listCmd

    $ # return

  getLatestVersion = (name, option) ->

    {registry} = option
    registry or= 'http://registry.npmjs.org'

    source = "./temp/update/#{name}.json"

    unless await $.isExisted source
      
      url = "#{registry}/#{name}?salt=#{_.now()}"
      await $.download url
      , './temp/update'
      , "#{name}.json"

    unless data = await $.read source
      throw makeError 'source'

    # return
    _.get data, 'dist-tags.latest'

  # return
  $.update = (arg...) -> execute arg...