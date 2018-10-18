###
source_(source)
###

$.source_ = (source) ->

  source = formatPath source

  await new Promise (resolve) ->

    listSource = []

    gulp.src source, read: false
    .on 'data', (item) -> listSource.push item.path
    .on 'end', -> resolve listSource