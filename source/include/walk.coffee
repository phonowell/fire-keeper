# https://github.com/jprichardson/node-klaw

###

  walk(source, callback)

###

$$.walk = (source, callback) ->

  unless source and callback
    throw makeError 'length'

  source = normalizePath source

  await new Promise (resolve) ->
    walk source
    .on 'data', (item) ->
      callback item
    .on 'end', -> resolve()

  $$ # return