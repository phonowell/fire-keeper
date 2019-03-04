$.isSame_ = (source) ->

  groupSource = normalizePathToArray source
  unless groupSource.length
    return false

  # check size
  cache = null
  for source in groupSource

    stat = await $.stat_ source
    unless stat
      return false

    {size} = stat

    unless cache
      cache = size
      continue

    unless size == cache
      return false

  # check content
  cache = null
  for source in groupSource

    $.info.pause '$.isSame_'
    cont = await $.read_ source
    $.info.resume '$.isSame_'
    
    unless cont
      return false

    cont = $.parseString cont

    unless cache
      cache = cont
      continue

    unless cont == cache
      return false

  true # return