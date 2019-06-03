###
getName(source)
###

$.getName = (source) ->

  unless source?.length or source > 0
    throw new Error "invalid source '#{source}'"

  source = source
  .replace /\\/g, '/'

  ###
  basename
  dirname
  extname
  filename
  ###

  extname = path.extname source
  basename = path.basename source, extname
  dirname = path.dirname source
  filename = "#{basename}#{extname}"

  # return
  {basename, dirname, extname, filename}

###
getBasename(source)
getDirname(source)
getExtname(source)
getFilename(source)
###

$.getBasename = (source) ->
  {basename} = $.getName source
  basename # return

$.getDirname = (source) ->
  {dirname} = $.getName source
  dirname # return

$.getExtname = (source) ->
  {extname} = $.getName source
  extname # return

$.getFilename = (source) ->
  {filename} = $.getName source
  filename # return
