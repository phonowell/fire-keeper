# https://github.com/mscdex/ssh2

class SSH

  constructor: -> @

  ###

    connect(option)
    disconnect()
    info(chunk)
    mkdir(source)
    remove(source)
    shell(cmd, [option])
    upload(source, target, [option])
    uploadDir(sftp, source, target)
    uploadFile(sftp, source, target)

  ###

  connect: (option) ->

    new Promise (resolve) =>

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

  disconnect: ->

    new Promise (resolve) =>

      {conn, option} = @storage

      conn.on 'end', ->

        $.info 'ssh'
        , "disconnected from '#{option.username}@#{option.host}'"

        resolve()

      .end()

  info: (chunk) ->

    string = $.trim $.parseString chunk
    if !string.length then return

    string = string
    .replace /\r/g, '\n'
    .replace /\n{2,}/g, ''

    $.i string

  mkdir: (source) ->

    source = formatArgument source

    cmd = ("mkdir -p #{src}" for src in source).join '; '

    $.info.pause '$$.ssh.mkdir'
    await @shell cmd
    $.info.resume '$$.ssh.mkdir'

    $.info 'ssh', "created #{wrapList source}"

  remove: (source) ->

    source = formatArgument source

    cmd = ("rm -fr #{src}" for src in source).join '; '

    $.info.pause '$$.ssh.remove'
    await @shell cmd
    $.info.resume '$$.ssh.remove'

    $.info 'ssh', "removed #{wrapList source}"

  shell: (cmd, option = {}) ->

    new Promise (resolve) =>

      {conn} = @storage

      cmd = formatArgument cmd
      cmd = cmd.join ' && '

      $.info 'ssh', colors.blue cmd

      conn.exec cmd, (err, stream) =>
        if err then throw err

        stream.on 'end', -> resolve()

        stream.stderr.on 'data', (chunk) =>
          if option.ignoreError
            return @info chunk
          throw $.parseString chunk
        stream.stdout.on 'data', (chunk) => @info chunk

  upload: (source, target, option = {}) ->

    new Promise (resolve) =>

      {conn} = @storage

      source = formatPath source

      option = switch $.type option
        when 'object' then _.clone option
        when 'string' then filename: option
        else throw makeError 'type'

      conn.sftp (err, sftp) =>

        if err then throw err

        for src in source

          stat = await $$.stat src
          filename = option.filename or path.basename src

          if stat.isDirectory()
            await @uploadDir sftp, src, "#{target}/#{filename}"

          else if stat.isFile()
            await @mkdir target
            await @uploadFile sftp, src, "#{target}/#{filename}"

        sftp.end()
        resolve()

  uploadDir: (sftp, source, target) ->

    new Promise (resolve) =>

      listSource = []
      await $$.walk source, (item) -> listSource.push item.path

      for src in listSource

        stat = await $$.stat src
        relativeTarget = path.normalize "#{target}/#{path.relative source, src}"

        if stat.isDirectory()
          await @mkdir relativeTarget

        else if stat.isFile()
          await @uploadFile sftp, src, relativeTarget

      resolve()

  uploadFile: (sftp, source, target) ->

    new Promise (resolve) ->

      sftp.fastPut source, target, (err) ->
        if err then throw err
        $.info 'ssh', "uploaded '#{source}' to '#{target}'"
        resolve()

# return
$$.ssh = new SSH()