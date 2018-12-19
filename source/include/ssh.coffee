# https://github.com/mscdex/ssh2

class SSH

  ###
  connect_(option)
  disconnect_()
  exec_(cmd, [option])
  info(chunk)
  mkdir_(source)
  remove_(source)
  uploadDir_(sftp, source, target)
  uploadFile_(sftp, source, target)
  upload_(source, target, [option])
  ###

  connect_: (option) ->

    await new Promise (resolve) =>

      {Client} = require 'ssh2'
      conn = new Client()

      conn
      .on 'error', (err) -> throw err
      .on 'ready', ->

        $.info 'ssh'
        , "connected to '#{option.username}@#{option.host}'"

        resolve()

      .connect option

      @storage = {conn, option}

    @ # return

  disconnect_: ->

    await new Promise (resolve) =>

      {conn, option} = @storage

      conn.on 'end', ->

        $.info 'ssh'
        , "disconnected from '#{option.username}@#{option.host}'"

        resolve()

      .end()

    @ # return

  exec_: (cmd, option = {}) ->

    await new Promise (resolve) =>

      {conn} = @storage

      cmd = formatArgument cmd
      cmd = cmd.join ' && '

      $.info 'ssh', chalk.blue cmd

      conn.exec cmd, (err, stream) =>
        if err then throw err

        stream.on 'end', -> resolve()

        stream.stderr.on 'data', (chunk) =>
          if option.ignoreError
            return @info chunk
          throw $.parseString chunk
        stream.stdout.on 'data', (chunk) => @info chunk

    @ # return

  info: (chunk) ->

    string = $.trim $.parseString chunk
    if !string.length then return

    string = string
    .replace /\r/g, '\n'
    .replace /\n{2,}/g, ''

    $.i string

  mkdir_: (source) ->

    source = formatArgument source

    cmd = ("mkdir -p #{src}" for src in source).join '; '

    $.info.pause '$.ssh.mkdir_'
    await @exec_ cmd
    $.info.resume '$.ssh.mkdir_'

    $.info 'ssh', "created #{wrapList source}"

    @ # return

  remove_: (source) ->

    source = formatArgument source

    cmd = ("rm -fr #{src}" for src in source).join '; '

    $.info.pause '$.ssh.remove_'
    await @exec_ cmd
    $.info.resume '$.ssh.remove_'

    $.info 'ssh', "removed #{wrapList source}"

    @ # return

  upload_: (source, target, option = {}) ->

    await new Promise (resolve) =>

      {conn} = @storage

      source = formatPath source

      option = switch $.type option
        when 'object' then _.clone option
        when 'string' then filename: option
        else throw new Error 'invalid type'

      conn.sftp (err, sftp) =>

        if err then throw err

        for src in source

          stat = await $.stat_ src
          filename = option.filename or path.basename src

          if stat.isDirectory()
            await @uploadDir_ sftp, src, "#{target}/#{filename}"

          else if stat.isFile()
            await @mkdir_ target
            await @uploadFile_ sftp, src, "#{target}/#{filename}"

        sftp.end()
        resolve()

    @ # return

  uploadDir_: (sftp, source, target) ->

    await new Promise (resolve) =>

      listSource = []
      await $.walk_ source, (item) -> listSource.push item.path

      for src in listSource

        stat = await $.stat_ src
        relativeTarget = path.normalize "#{target}/#{path.relative source, src}"

        if stat.isDirectory()
          await @mkdir_ relativeTarget

        else if stat.isFile()
          await @uploadFile_ sftp, src, relativeTarget

      resolve()

    @ # return

  uploadFile_: (sftp, source, target) ->

    await new Promise (resolve) ->

      sftp.fastPut source, target, (err) ->
        if err then throw err
        $.info 'ssh', "uploaded '#{source}' to '#{target}'"
        resolve()

    @ # return

# return
$.ssh = new SSH()