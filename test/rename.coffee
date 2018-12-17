# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
###
check_(source, target, contSource)
clean_()
###

check_ = (source, target, contSource) ->

  if await $.isExisted_ source
    throw new Error 'invalid source'

  unless await $.isExisted_ target
    throw new Error 'invalid target'

  unless contSource == await $.read_ target
    throw new Error 'invalid content'

clean_ = -> await $.remove_ temp

# test

describe '$.rename_(source, option)', ->

  it "$.rename_('#{temp}/a.txt', 'b.txt')", ->
    await clean_()

    source = "#{temp}/a.txt"
    target = "#{temp}/b.txt"
    contSource = 'to be renamed'

    await $.write_ source, contSource

    res = await $.rename_ source, 'b.txt'

    if res != $
      throw new Error()

    await check_ source, target, contSource

    await clean_()

  it "$.rename_('#{temp}/a.txt', {extname: '.md', suffix: '-test'})", ->
    await clean_()

    source = "#{temp}/a.txt"
    target = "#{temp}/a-test.md"
    contSource = 'to be renamed'

    await $.write_ source, contSource

    res = await $.rename_ source,
      extname: '.md'
      suffix: '-test'

    if res != $
      throw new Error()

    await check_ source, target, contSource

    await clean_()

  it "$.rename_('#{temp}/*.txt', extname: '.md')", ->
    await clean_()

    listFilename = ($.parseString i for i in [0...5])

    for filename in listFilename
      source = "./temp/#{filename}.txt"
      contSource = filename
      await $.write_ source, contSource

    res = await $.rename_ "#{temp}/*.txt",
      extname: '.md'

    if res != $
      throw new Error()

    for filename in listFilename

      source = "./temp/#{filename}.txt"
      target = "./temp/#{filename}.md"
      contSource = filename
      
      await check_ source, target, contSource

    await clean_()