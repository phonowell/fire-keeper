archiver = require 'archiver'
fs = require 'fs'
kleur = require 'kleur'
ora = require 'ora'

class M

  ###
  ---
  archive_(option)
  execute_(arg...)
  getBase(source)
  getOption(option)
  ###

  archive_: (option) ->

    {base, filename, source, target} = option

    spinner = ora().start()

    await new Promise (resolve) ->

      output = fs.createWriteStream "#{target}/#{filename}"
      archive = archiver 'zip',
        zlib:
          level: 9
      msg = null

      ###
      end
      entry
      error
      progress
      warning
      ###

      archive.on 'end', ->
        spinner.succeed()
        resolve()

      archive.on 'entry', (e) ->
        msg = $.info().renderPath e.sourcePath

      archive.on 'error', (e) ->
        spinner.fail e.message
        throw e.message

      archive.on 'progress', (e) ->

        unless msg
          return

        gray = kleur.gray "#{e.fs.processedBytes * 100 // e.fs.totalBytes}%"
        magenta = kleur.magenta msg
        msg = "#{gray} #{magenta}"

        spinner.text = msg
        msg = null

      archive.on 'warning', (e) ->
        spinner.warn e.message
        throw e.message

      # execute
      archive.pipe output

      for source in await $.source_ source
        name = source.replace base, ''
        archive.file source, {name}

      archive.finalize()

    @ # return

  execute_: (source, target, option) ->

    _source = source
    source = $.normalizePathToArray source

    target or= $.getDirname(source[0]).replace /\*/g, ''
    target = $.normalizePath target

    [base, filename] = @getOption option
    base = $.normalizePath base or @getBase _source
    filename or= "#{$.getBasename target}.zip"

    await @archive_ {base, filename, source, target}

    $.info 'zip'
    , "zipped #{$.wrapList source}
    to '#{target}',
    named as '#{filename}'"

    @ # return

  getBase: (source) ->

    type = $.type source
    source = switch type
      when 'array' then source[0]
      when 'string' then source
      else throw "zip_/error: invalid type '#{type}'"

    if source.includes '*'
      return _.trim (source.replace /\*.*/, ''), '/'

    $.getDirname source # return

  getOption: (option) ->

    type = $.type option
    switch type
      
      when 'object'
        [option.base, option.filename]

      when 'string'
        [null, option]

      else [null, null]

module.exports = (arg...) ->
  m = new M()
  await m.execute_ arg...
  @ # return