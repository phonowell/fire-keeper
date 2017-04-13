$$.makeDirectory = co (src) ->

  if !src then throw _error 'length'

  mkdirp = require 'mkdirp'
  src = path.normalize src

  yield new Promise (resolve) ->
    mkdirp src, (err) ->
      if err then throw err
      resolve()

  $.info 'create', "created '#{src}'"

$$.mkdir = $$.makeDirectory