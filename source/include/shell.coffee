class Shell

  ###
  spawn
  ###

  spawn: require('child_process').spawn

  ###
  close()
  execute_(cmd, [option])
  info([type], string)
  ###

  close: ->
    @process.kill()
    @ # return

  execute_: (cmd, option = {}) ->

    new Promise (resolve) =>

      type = $.type cmd
      cmd = switch type
        when 'array' then cmd.join ' && '
        when 'string' then cmd
        else throw new Error "invalid argument type <#{type}>"

      $.info 'shell', cmd

      isIgnoreError = !!option.ignoreError
      delete option.ignoreError

      [cmder, arg] = if $.os == 'windows'
        [
          'cmd.exe'
          ['/s', '/c', "\"#{cmd}\""]
        ]
      else
        [
          '/bin/sh'
          ['-c', cmd]
        ]

      @process = @spawn cmder, arg, option

      # bind
      
      @process.stderr.on 'data', (data) => @info 'error', data
      @process.stdout.on 'data', (data) => @info data

      @process.on 'close', (code) ->
        if code == 0 or isIgnoreError
          return resolve true
        resolve false

  info: (arg...) ->

    [type, string] = switch arg.length
      when 1 then [null, arg[0]]
      when 2 then arg
      else throw makeError 'length'

    string = $.trim string
    if !string.length then return

    string = string
    .replace /\r/g, '\n'
    .replace /\n{2,}/g, ''

    string = switch type
      when 'error' then chalk.red string
      else chalk.gray string

    $.log string

# return
$.shell_ = (cmd, option) ->
  shell = new Shell()
  if !cmd then return shell
  await shell.execute_ cmd, option