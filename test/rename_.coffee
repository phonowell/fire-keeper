check_ = (source, target, contSource) ->

  if await $.isExisted_ source
    throw 'invalid source'

  unless await $.isExisted_ target
    throw 'invalid target'

  unless contSource == await $.read_ target
    throw 'invalid content'

it "$.rename_('#{temp}/a.txt', 'b.txt')", ->
  await clean_()

  source = "#{temp}/a.txt"
  target = "#{temp}/b.txt"
  contSource = 'to be renamed'

  await $.write_ source, contSource

  result = await $.rename_ source, 'b.txt'

  unless result == $
    throw 0

  await check_ source, target, contSource

  await clean_()

it "$.rename_('#{temp}/a.txt', {extname: '.md', suffix: '-test'})", ->
  await clean_()

  source = "#{temp}/a.txt"
  target = "#{temp}/a-test.md"
  contSource = 'to be renamed'

  await $.write_ source, contSource

  result = await $.rename_ source,
    extname: '.md'
    suffix: '-test'

  unless result == $
    throw 0

  await check_ source, target, contSource

  await clean_()

it "$.rename_('#{temp}/*.txt', extname: '.md')", ->
  await clean_()

  listFilename = ($.parseString i for i in [0...5])

  for filename in listFilename
    source = "./temp/#{filename}.txt"
    contSource = filename
    await $.write_ source, contSource

  result = await $.rename_ "#{temp}/*.txt",
    extname: '.md'

  unless result == $
    throw 0

  for filename in listFilename

    source = "./temp/#{filename}.txt"
    target = "./temp/#{filename}.md"
    contSource = filename
    
    await check_ source, target, contSource

  await clean_()