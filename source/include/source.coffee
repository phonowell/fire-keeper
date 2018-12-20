###
source_(source, [option])
###

$.source_ = (source, option) ->

  source = normalizePathToArray source
  option = _.merge
    allowEmpty: true
    read: false
  , option

  await new Promise (resolve) ->

    listSource = []

    gulp.src source, option
    .on 'data', (item) -> listSource.push item.path
    .on 'end', -> resolve listSource