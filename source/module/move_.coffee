export default (source, target) ->

  unless source and target
    throw 'move_/error: invalid argument length'

  listSource = await $.source_ source
  unless listSource.length
    return @

  await $.info().silence_ ->
    await $.copy_ listSource, target
    await $.remove_ listSource

  $.info 'move'
  , "moved #{$.wrapList source} to '#{target}'"

  @ # return