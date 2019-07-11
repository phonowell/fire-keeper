it "$.walk_('#{temp}')", ->
  await clean_()

  await $.mkdir_ "#{temp}/a"

  string = 'empty'

  await $.write_ "#{temp}/b/c.txt", string
  await $.write_ "#{temp}/d.txt", string

  listResult = []

  result = await $.walk_ temp, (item) ->
    listResult.push item.path

  unless result == $
    throw 0

  unless _.isEqual listResult, $.normalizePathToArray [
    temp
    "#{temp}/a"
    "#{temp}/b"
    "#{temp}/d.txt"
    "#{temp}/b/c.txt"
  ]
    throw 1

  await clean_()