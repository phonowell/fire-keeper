class Shell

  ###
  close()
  execute(cmd, [option])
  info([type], string)
  separator
  spawn
  ###

  close: ->
    @process.kill()
    @ # return

  execute: (cmd, option = {}) ->

    new Promise (resolve) =>

      type = $.type cmd
      cmd = switch type
        when 'array' then cmd.join " #{@separator} "
        when 'string' then cmd
        else throw new Error "invalid argument type <#{type}>"

      $.info 'shell', cmd

      isIgnoreError = !!option.ignoreError
      delete option.ignoreError

      [cmder, arg] = if $$.os == 'windows'
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
      when 'error' then colors.red string
      else colors.gray string

    $.log string

  separator: do ->
    platform = (require 'os').platform()
    switch platform
      when 'win32' then '&'
      else '&&'

  spawn: require('child_process').spawn

# return
$$.shell = (cmd, option) ->
  shell = new Shell()
  if !cmd then return shell
  shell.execute cmd, option