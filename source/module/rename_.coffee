gulp = require 'gulp'
using = require 'gulp-using'

# return
$.rename_ = (source, option) ->

  source = normalizePathToArray source

  listHistory = []

  await new Promise (resolve) ->

    # require
    rename = require 'gulp-rename'

    gulp.src source
    .pipe using()
    .pipe rename option
    .pipe gulp.dest (e) ->
      listHistory.push e.history
      e.base
    .on 'end', -> resolve()

  $.info.pause '$.rename_'
  for item in listHistory
    if await $.isExisted_ item[1]
      await $.remove_ item[0]
  $.info.resume '$.rename_'

  $.info 'file'
  , "renamed #{wrapList source} as '#{$.parseString option}'"

  $ # return
