class Shell

  ###
  bind()
  close()
  exec
  execute(cmd, [option])
  info([type], string)
  separator
  ###

  bind: ->
    @process.stderr.on 'data', (data) => @info 'error', data
    @process.stdout.on 'data', (data) => @info data
    @ # return

  close: ->
    @process.kill()
    @ # return

  exec: require('child_process').exec

  execute: (cmd, option = {}) ->

    new Promise (resolve) =>

      type = $.type cmd
      cmd = switch type
        when 'array' then cmd.join " #{@separator} "
        when 'string' then cmd
        else throw new Error "invalid argument type <#{type}>"

      $.info 'shell', cmd

      @process = @exec cmd, (err) ->
        if !err then return resolve true
        if option.ignoreError then return resolve false
        throw new Error err
      
      @bind()

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

    # string = $.info.renderColor string

    $.log string

  separator: do ->
    platform = (require 'os').platform()
    switch platform
      when 'win32' then '&'
      else '&&'

# return
$$.shell = (cmd, option) ->
  shell = new Shell()
  if !cmd then return shell
  shell.execute cmd, option