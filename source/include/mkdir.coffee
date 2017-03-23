$$.makeDirectory = co (src) ->

  if !src then throw new Error ERROR.length

  mkdirp = require 'mkdirp'
  src = path.normalize src

  yield new Promise (resolve) ->
    mkdirp src, (err) ->
      if err then throw new Error err
      resolve()

  $.info 'create', "created '#{src}'"

$$.mkdir = $$.makeDirectory