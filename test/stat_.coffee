it '$.stat_("./temp/package.json")', ->
  await clean_()

  await $.copy_ './package.json', temp

  stat = await $.stat_ './package.json'

  if ($.type stat) != 'object'
    throw 0

  if ($.type stat.atime) != 'date'
    throw 1

  if $.type(stat.size) != 'number'
    throw 2

  await clean_()

it '$.stat_("./temp/null.txt")', ->
  await clean_()

  stat = await $.stat_ "#{temp}/null.txt"

  if stat?
    throw 0

  await clean_()