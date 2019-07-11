it "$.mkdir_('#{temp}/m/k/d/i/r')", ->
  await clean_()

  res = await $.mkdir_ "#{temp}/m/k/d/i/r"

  if res != $
    throw 0

  unless await $.isExisted_ "#{temp}/m/k/d/i/r"
    throw 0

  await clean_()

it "$.mkdir_(['#{temp}/a', '#{temp}/b', '#{temp}/c'])", ->
  await clean_()

  listSource = [
    "#{temp}/a"
    "#{temp}/b"
    "#{temp}/c"
  ]

  res = await $.mkdir_ listSource

  if res != $
    throw 0

  isExisted = await $.isExisted_ [
    "#{temp}/a"
    "#{temp}/b"
    "#{temp}/c"
  ]

  unless isExisted
    throw 0

  await clean_()