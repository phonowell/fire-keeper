gulp = require 'gulp'

# path = require 'path'

# return
$.source_ = (source, option) ->

  groupSource = normalizePathToArray source
  
  option = _.merge
    allowEmpty: true
    read: false
  , option

  await new Promise (resolve) ->

    listSource = []

    unless groupSource.length
      return resolve []
    gulp.src groupSource, option
    .on 'data', (item) -> listSource.push item.path
    .on 'end', -> resolve listSource
