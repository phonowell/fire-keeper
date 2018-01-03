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

  addCmd = (list, data, isDev, option) ->

    {registry} = option

    for name, version of data

      current = version
      .replace /[~^]/, ''

      $.info.pause '$$.update'
      latest = await getLatestVersion name, option
      $.info.resume '$$.update'

      if current == latest
        $.info 'update'
        , "'#{name}': '#{current}' == '#{latest}'"
        continue
      $.info 'update'
      , "'#{name}': '#{current}' #{colors.green '->'} '#{latest}'"

      cmd = []
      cmd.push 'npm install'
      cmd.push "#{name}@#{latest}"
      if registry
        cmd.push "--registry #{registry}"
      cmd.push if isDev
        '--save-dev'
      else '--save'

      list.push cmd.join ' '

  clean = ->

    await $$.remove './temp/update'

    listFile = await $$.source './temp/**/*.*'

    if !listFile.length
      await $$.remove './temp'

  getLatestVersion = (name, option) ->

    {registry} = option
    registry or= 'http://registry.npmjs.org'

    source = "./temp/update/#{name}.json"

    unless await $$.isExisted source
      url = "#{registry}/#{name}/latest?salt=#{_.now()}"
      await $$.download url
      , './temp/update'
      , "#{name}.json"

    unless data = await $$.read source
      throw makeError 'source'

    # return
    data.version

  #
  
  fn = (option) ->

    pkg = await $$.read './package.json'

    listCmd = []
    await addCmd listCmd, pkg.dependencies, false, option
    await addCmd listCmd, pkg.devDependencies, true, option
    
    $.info.pause '$$.update'
    await clean()
    $.info.resume '$$.update'

    if !listCmd.length
      $.info 'update', 'every thing is ok'
      return

    await $$.shell listCmd

    # return
    $$

  # return
  $$.update = fn