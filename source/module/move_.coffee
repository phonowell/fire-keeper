$.move_ = (source, target) ->

  unless source and target
    throw new Error 'invalid argument length'

  listSource = await $.source_ source
  unless listSource.length
    return $

  $.info.pause '$.move_'
  await $.copy_ listSource, target
  await $.remove_ listSource
  $.info.resume '$.move_'

  $.info 'move'
  , "moved #{wrapList source} to '#{target}'"

  $ # return
