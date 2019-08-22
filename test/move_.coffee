it 'file/existed', ->
  await clean_()

  source = "#{temp}/source/test.txt"

  await $.chain $
  .write_ source, 'test message'
  .move_ source, "#{temp}/target"

  isExisted = await $.isExisted_ "#{temp}/target/test.txt"
  unless isExisted
    throw 0

  await clean_()

it 'file/not existed', ->
  await clean_()

  await $.move_ "#{temp}/source/test.txt", "#{temp}/target"

  isExisted = await $.isExisted_ "#{temp}/target/test.txt"
  if isExisted
    throw 0

  await clean_()

it 'folder/existed', ->
  await clean_()

  await $.chain $
  .write_ "#{temp}/source/test.txt", 'test message'
  .move_ "#{temp}/source/**/*", "#{temp}/target"

  isExisted = await $.isExisted_ "#{temp}/target/test.txt"
  unless isExisted
    throw 0

  await clean_()

it 'folder/not existed', ->
  await clean_()

  await $.move_ "#{temp}/source/**/*", "#{temp}/target"

  isExisted = await $.isExisted_ "#{temp}/target/test.txt"
  if isExisted
    throw 0

  await clean_()

it 'outer/existed', ->

  base = '~/Downloads'

  await $.chain $
  .write_ "#{base}/source/test.txt", 'test message'
  .move_ "#{base}/source/test.txt", "#{base}/target"

  isExisted = await $.isExisted_ "#{base}/target/test.txt"
  unless isExisted
    throw 0

  await $.remove_ [
    "#{base}/source"
    "#{base}/target"
  ]

it 'outer/not existed', ->

  base = '~/Downloads'

  await $.move_ "#{base}/source/test.txt", "#{base}/target"

  isExisted = await $.isExisted_ "#{base}/target/test.txt"
  if isExisted
    throw 0

  await $.remove_ [
    "#{base}/source"
    "#{base}/target"
  ]

it 'other/[]', -> await $.move_ [], temp

it 'other/move & rename', ->
  await clean_()

  await $.write_ './temp/test.txt', 'a test message'
  await $.move_ './temp/test.txt', './temp/a', 'b.txt'

  isExisted_ = await $.isExisted_ './temp/a/b.txt'
  unless isExisted_
    throw 0

  await clean_()