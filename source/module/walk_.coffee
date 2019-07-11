walk = require 'klaw'

export default (source, callback) ->

  unless source and callback
    throw 'walk_/error: invalid argument length'

  source = $.normalizePath source

  await new Promise (resolve) ->

    walk source
    .on 'data', (item) ->
      callback _.merge item,
        path: $.normalizePath item.path
    .on 'end', -> resolve()

  @ # return