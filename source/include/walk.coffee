# https://github.com/jprichardson/node-klaw

###
walk_(source, callback)
###

$.walk_ = (source, callback) ->

  unless source and callback
    throw new Error 'invalid argument length'

  source = normalizePath source

  await new Promise (resolve) ->

    # require
    walk = getPlugin 'klaw'

    walk source
    .on 'data', (item) ->
      callback _.merge item,
        path: normalizePath item.path
    .on 'end', -> resolve()

  $ # return