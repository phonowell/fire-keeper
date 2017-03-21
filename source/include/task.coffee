# task

$$.task = (args...) ->
  switch args.length
    when 1 then gulp.tasks[args[0]].fn
    when 2 then gulp.task args...
    else throw new Error ERROR.length

# added fire keeper task

$$.task 'default', ->
  list = []
  for key of gulp.tasks
    list.push key
  list.sort()
  $.info 'task', list.join ', '

$$.task 'noop', -> null