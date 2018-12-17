###
unzip_(source, [target])
zip_(source, [target], [option])
###

$.unzip_ = (source, target) ->

  unless source
    throw new Error 'invalid source'

  listSource = await $.source_ source

  # require
  unzip = getPlugin 'unzip'

  for src in listSource

    dist = target or $.getDirname src

    await new Promise (resolve) ->
      stream = fs.createReadStream src
      stream.on 'end', -> resolve()
      stream.pipe unzip.Extract
        path: dist

    $.info 'zip', "unzipped #{src} to #{dist}"

  $ # return

$.zip_ = (arg...) ->

  [source, target, option] = switch arg.length
    when 1 then [arg[0], null, null]
    when 2 then [arg[0], null, arg[1]]
    when 3 then arg
    else throw new Error 'invalid argument length'

  _source = source
  source = formatPath source

  target or= path.dirname(source[0]).replace /\*/g, ''
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

  filename or= "#{path.basename target}.zip"
  filename = "#{target}/#{filename}"

  await new Promise (resolve) ->

    # require
    archiver = getPlugin 'archiver'

    output = fs.createWriteStream filename
    archive = archiver 'zip',
      zlib:
        level: 9

    archive.on 'warning', (err) -> throw err
    archive.on 'error', (err) -> throw err
    
    msg = null
    archive.on 'entry', (e) ->
      if isSilent then return
      msg = $.info.renderPath e.sourcePath
      
    archive.on 'progress', (e) ->
      if isSilent then return
      if !msg then return
      gray = chalk.gray "#{e.fs.processedBytes * 100 // e.fs.totalBytes}%"
      magenta = chalk.magenta msg
      msg = "#{gray} #{magenta}"
      $.i msg
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
  to #{wrapList target},
  named as '#{filename}'"

  $ # return