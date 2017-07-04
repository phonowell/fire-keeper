# task

$$.task = (arg...) ->
  switch arg.length
    when 1 then gulp.tasks[arg[0]].fn
    when 2 then gulp.task arg...
    else throw _error 'length'

# added fire keeper task

$$.task 'default', ->
  list = []
  for key of gulp.tasks
    list.push key
  list.sort()
  $.info 'task', ("'#{a}'" for a in list).join ', '

$$.task 'noop', -> null