path = require 'path'

export default (source) ->

  unless source?.length or source > 0
    throw "getName/error: invalid source '#{source}'"

  source = source
  .replace /\\/g, '/'

  extname = path.extname source
  basename = path.basename source, extname
  dirname = path.dirname source
  filename = "#{basename}#{extname}"

  # return
  {basename, dirname, extname, filename}