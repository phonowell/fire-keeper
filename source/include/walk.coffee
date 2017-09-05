# https://github.com/jprichardson/node-klaw

###

  walk(source, callback)

###

$$.walk = co (source, callback) ->

  unless source and callback
    throw makeError 'length'

  source = normalizePath source

  yield new Promise (resolve) ->
    walk source
    .on 'data', (item) ->
      callback item
    .on 'end', -> resolve()

  # return
  $$
