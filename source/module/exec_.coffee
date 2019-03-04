kleur = require 'kleur'

class M

  ###
  spawn
  ###

  spawn: require('child_process').spawn

  ###
  close()
  execute_(cmd, [option])
  info([type], string)
  parseMessage(buffer)
  ###

  close: ->
    @process.kill()
    @ # return

  execute_: (cmd, option = {}) ->

    type = $.type cmd
    cmd = switch type
      when 'array' then cmd.join ' && '
      when 'string' then cmd
      else throw new Error "invalid type '#{type}'"

    isIgnoreError = !!option.ignoreError
    delete option.ignoreError
    isSilent = !!option.silent
    delete option.silent

    [cmder, arg] = if $.os == 'windows'
      [
        'cmd.exe'
        ['/s', '/c', cmd]
      ]
    else
      [
        '/bin/sh'
        ['-c', cmd]
      ]

    unless isSilent
      $.info 'exec', cmd

    [status, result] = await new Promise (resolve) =>
      res = null

      @process = @spawn cmder, arg, option

      # bind

      @process.stderr.on 'data', (data) =>
        res = @parseMessage data
        unless isSilent
          @info 'error', data
      
      @process.stdout.on 'data', (data) =>
        res = @parseMessage data
        unless isSilent
          @info data

      @process.on 'close', (code) ->
        if code == 0 or isIgnoreError
          return resolve [true, res]
        resolve [false, res]

    [status, result] # return

  info: (arg...) ->

    [type, string] = switch arg.length
      when 1 then [null, arg[0]]
      when 2 then arg
      else throw new Error 'invalid argument length'

    string = $.trim string
    unless string.length
      return

    string = string
    .replace /\r/g, '\n'
    .replace /\n{2,}/g, ''

    string = switch type
      when 'error' then kleur.red string
      else kleur.gray string

    $.log string

  parseMessage: (buffer) ->
    _.trimEnd ($.parseString buffer), '\n'

# return
$.exec_ = (cmd, option) ->
  
  unless cmd
    return false
  
  m = new M()
  await m.execute_ cmd, option