it 'default', ->

  type = $.type $.backup_
  unless type == 'asyncfunction'
    throw 0

it 'detail', ->

  await clean_()

  listSource =
  await $.copy_ [
    './license.md'
    './readme.md'
  ], temp

  listSource = [
    "#{temp}/license.md"
    "#{temp}/readme.md"
  ]

  listTarget = [
    "#{temp}/license.md.bak"
    "#{temp}/readme.md.bak"
  ]

  result = await $.backup_ listSource
  unless result == $
    throw 0

  unless await $.isExisted_ listTarget
    throw 1

  listDataSource = (
    await $.read_ source, raw: true for source in listSource
  )
  listDataTarget = (await $.read_ source for source in listTarget)

  unless _.isEqual listDataSource, listDataTarget
    throw 2

  await clean_()