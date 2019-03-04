fs = require 'fs'

# return
$.stat_ = (source) ->

  source = normalizePath source

  unless await $.isExisted_ source
    $.info 'file', "#{wrapList source} not existed"
    return null

  # return
  new Promise (resolve) ->

    fs.stat source, (err, stat) ->
      
      if err
        throw err
      
      resolve stat