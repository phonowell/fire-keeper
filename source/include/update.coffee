class Updater

  ###
  cache
  listCmd
  namespace
  pathCache
  ###

  cache: null
  listCmd: []
  namespace: '$.update_'
  pathCache: './temp/cache-update.json'

  ###
  clean_()
  execute_(arg...)
  getLatestVersion_(name)
  listPkg_(list, isDev)
  ###

  clean_: ->
    await $.clean_ @pathCache

  execute_: (arg...) ->

    data = await $.read_ './package.json'

    await $.chain @
    .listPkg_ data.dependencies, false
    .listPkg_ data.devDependencies, true

    unless @listCmd.length
      $.info 'update'
      , 'everything is ok'
      await @clean_()
      return @
    
    await $.exec_ @listCmd
    await @clean_()

    @ # return

  getLatestVersion_: (name) ->

    @cache or= await $.read_ @pathCache
    @cache or= {}

    version = @cache[name]
    if version
      return version

    [status, version] = await $.exec_ "npm view #{name} version",
      silent: true
    unless status
      throw new Error version

    @cache[name] = version
    await $.write_ @pathCache, @cache

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