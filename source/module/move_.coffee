export default (source, target, option) ->

  unless source and target
    throw 'move_/error: invalid argument length'

  listSource = await $.source_ source
  unless listSource.length
    return @

  await $.info().silence_ ->
    await $.copy_ listSource, target, option
    await $.remove_ listSource

  # info
  msg = "moved #{$.wrapList source} to '#{target}'"
  if option
    msg += ", as '#{$.parseString option}'"
  $.info 'move', msg

  @ # return