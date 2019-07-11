it './temp/re', ->
  await clean_()

  await $.write_ "#{temp}/re/move.txt", 'to be removed'

  result = await $.remove_ "#{temp}/re"

  unless result == $
    throw 0

  if await $.isExisted_ "#{temp}/re"
    throw 1

  await clean_()

it "['./temp/a', './temp/b', './temp/c.txt'])", ->
  await clean_()

  await $.mkdir_ [
    "#{temp}/a"
    "#{temp}/b"
  ]

  await $.write_ "#{temp}/c.txt", 'empty'

  listSource = [
    "#{temp}/a"
    "#{temp}/b"
    "#{temp}/c.txt"
  ]

  result = await $.remove_ listSource

  unless result == $
    throw 0

  if await $.isExisted_ listSource
    throw 1

  await clean_()
  
it './temp/**/*.txt', ->
  await clean_()
  
  listSource = [
    "#{temp}/a.txt"
    "#{temp}/b/c.txt"
  ]
  string = 'empty'

  for source in listSource
    await $.write_ source, string
  
  result = await $.remove_ "#{temp}/**/*.txt"
  
  unless result == $
    throw 0
    
  if await $.isExisted_ listSource
    throw 1

  unless await $.isExisted_ "#{temp}/b"
    throw 2

  await clean_()