class Shell

  ###
  close()
  execute_(cmd, [option])
  info([type], string)
  spawn
  ###

  close: ->
    @process.kill()
    @ # return

  execute_: (cmd, option = {}) ->

    await new Promise (resolve) =>

      type = $.type cmd
      cmd = switch type
        when 'array' then cmd.join ' && '
        when 'string' then cmd
        else throw new Error 'invalid type'

      $.info 'exec', cmd

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

    @ # return

  info: (arg...) ->

    [type, string] = switch arg.length
      when 1 then [null, arg[0]]
      when 2 then arg
      else throw new Error 'invalid argument length'

    string = $.trim string
    if !string.length then return

    string = string
    .replace /\r/g, '\n'
    .replace /\n{2,}/g, ''

    string = switch type
      when 'error' then kleur.red string
      else kleur.gray string

    $.log string

  spawn: require('child_process').spawn

# return
$.exec_ = (cmd, option) ->
  shell = new Shell()
  if !cmd then return shell
  await shell.execute_ cmd, option