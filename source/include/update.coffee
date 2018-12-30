class Updater

  ###
  listCmd
  namespace
  ###

  listCmd: []
  namespace: '$.update_'

  ###
  execute_(arg...)
  getLatestVersion_(name)
  listPkg_(list, isDev)
  ###

  execute_: (arg...) ->

    data = await $.read_ './package.json'

    await @listPkg_ data.dependencies, false
    await @listPkg_ data.devDependencies, true

    unless @listCmd.length
      $.info 'update'
      , 'every ting is ok'
      return @
    
    await $.exec_ @listCmd

    @ # return

  getLatestVersion_: (name) ->

    url = [
      'http://registry.npmjs.org'
      "/#{name}/latest"
    ].join ''

    {version} = await $.get_ url
    version # return

  listPkg_: (list, isDev) ->

    for name, version of list

      versionCurrent = version
      .replace /[~^]/, ''

      $.info.pause @namespace
      versionLatest = await @getLatestVersion_ name
      $.info.resume @namespace

      if versionCurrent == versionLatest
        $.info 'update'
        , "'#{name}':
        '#{versionCurrent}'
        ==
        '#{versionLatest}'"
        continue

      $.info 'update'
      , "'#{name}':
      '#{versionCurrent}'
      #{kleur.green '->'}
      '#{versionLatest}'"

      lineCmd = [
        'npm install'
        "#{name}@#{versionLatest}"
        if isDev then '' else '--production'
        if isDev then '--save-dev' else '--save'
      ].join ' '
      lineCmd = lineCmd
      .replace /\s{2,}/g, ' '

      @listCmd.push lineCmd

    @ # return

# return
$.update_ = (arg...) ->
  m = new Updater()
  await m.execute_ arg...
  $ # return