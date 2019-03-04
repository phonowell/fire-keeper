fs = require 'fs'

# return
$.read_ = (source, option = {}) ->

  pathSource = source
  listSource = await $.source_ pathSource

  unless listSource?.length
    $.info 'file', "'#{pathSource}' not existed"
    return null
  source = listSource[0]

  res = await new Promise (resolve) ->
    fs.readFile source, (err, data) ->
      
      if err
        throw err
      
      resolve data

  $.info 'file', "read '#{source}'"

  # return

  if option.raw
    return res

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
    return $.parseString res

  if extname == '.json'
    return $.parseJSON res

  if extname in ['.yaml', '.yml']
    jsYaml = require 'js-yaml'
    return jsYaml.safeLoad res

  res # return