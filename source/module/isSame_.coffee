export default (source) ->

  # why $.normailizePathToArray, but not $.source_?
  # because source may be not existed
  listSource = $.normalizePathToArray source
  unless listSource.length
    return false

  # size
  cache = null
  for source in listSource

    stat = await $.stat_ source
    unless stat
      return false

    {size} = stat

    unless cache
      cache = size
      continue

    unless size == cache
      return false

  # content
  cache = null
  for source in listSource

    cont = await $.info().silence_ ->
      await $.read_ source
    
    unless cont
      return false

    cont = $.parseString cont

    unless cache
      cache = cont
      continue

    unless cont == cache
      return false

  true # return