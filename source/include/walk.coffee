# https://github.com/jprichardson/node-klaw

###
walk_(source, callback)
###

$.walk_ = (source, callback) ->

  unless source and callback
    throw makeError 'length'

  source = normalizePath source

  await new Promise (resolve) ->
    walk source
    .on 'data', (item) ->
      callback item
    .on 'end', -> resolve()

  $ # return