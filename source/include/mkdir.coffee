###

  mkdir(source)

###

$$.mkdir = co (source) ->

  if !source then throw _error 'length'

  mkdirp = require 'mkdirp'
  source = _formatPath source

  listPromise = []
  for src in source
    listPromise.push yield new Promise (resolve) ->
      mkdirp src, (err) ->
        if err then throw err
        resolve()

  yield Promise.all listPromise

  $.info 'create', "created '#{source}'"

  # return
  $$