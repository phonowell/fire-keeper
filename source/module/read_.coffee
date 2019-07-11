fs = require 'fs'

export default (source, option = {}) ->

  _source = source
  listSource = await $.source_ source

  unless listSource.length
    $.info 'file', "'#{source}' not existed"
    return null
  source = listSource[0]

  result = await new Promise (resolve) ->
    fs.readFile source, (err, data) ->
      if err then throw err
      resolve data

  $.info 'file', "read '#{_source}'"

  # return

  if option.raw
    return result

  extname = $.getExtname source

  if extname in [
    '.coffee'
    '.css'
    '.html'
    '.js'
    '.md'
    '.pug'
    '.sh'
    '.styl'
    '.txt'
    '.xml'
  ]
    return $.parseString result

  if extname == '.json'
    return $.parseJson result

  if extname in ['.yaml', '.yml']
    jsYaml = require 'js-yaml'
    return jsYaml.safeLoad result

  result # return