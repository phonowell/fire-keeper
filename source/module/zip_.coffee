fs = require 'fs'
kleur = require 'kleur'
path = require 'path'

# return
$.zip_ = (arg...) ->

  [source, target, option] = arg

  _source = source
  source = normalizePathToArray source

  target or= $.getDirname(source[0]).replace /\*/g, ''
  target = normalizePath target

  [base, filename, isSilent] = switch $.type option
    when 'object' then [
      option.base
      option.filename
      option.silent or option.isSilent
    ]
    when 'string' then [null, option, false]
    else [null, null, false]
    
  base or= do ->
    _source = switch $.type _source
      when 'array' then _source[0]
      when 'string' then _source
      else throw new Error 'invalid type'
    if ~_source.search /\*/
      return _.trim (_source.replace /\*.*/, ''), '/'
    path.dirname _source
  base = normalizePath base

  filename or= "#{$.getBasename target}.zip"

  await new Promise (resolve) ->

    # require
    ansi = require 'sisteransi'
    archiver = require 'archiver'

    output = fs.createWriteStream "#{target}/#{filename}"
    archive = archiver 'zip',
      zlib:
        level: 9

    archive.on 'warning', (err) -> throw err
    archive.on 'error', (err) -> throw err
    
    msg = null
    archive.on 'entry', (e) ->
      if isSilent
        return
      msg = $.info.renderPath e.sourcePath
      
    archive.on 'progress', (e) ->
      
      if isSilent
        return
      
      unless msg
        return
      
      gray = kleur.gray "#{e.fs.processedBytes * 100 // e.fs.totalBytes}%"
      magenta = kleur.magenta msg
      msg = "#{gray} #{magenta}"
      $.i [
        ansi.erase.line
        msg
        ansi.cursor.up()
      ].join ''
      msg = null
      
    archive.on 'end', -> resolve()

    archive.pipe output

    listSource = await $.source_ source
    for src in listSource
      name = src.replace base, ''
      archive.file src, {name}

    archive.finalize()

  $.info 'zip'
  , "zipped #{wrapList source}
  to '#{target}',
  named as '#{filename}'"

  $ # return