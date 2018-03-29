# require

$$ = require './../index'
{$, _} = $$.library

# variable

temp = './temp'

# function

###
check(source, target, contSource)
clean()
###

check = (source, target, contSource) ->

  if await $$.isExisted source
    throw new Error 'source'

  unless await $$.isExisted target
    throw new Error 'target'

  contTarget = await $$.read target
  if contTarget != contSource
    throw new Error 'cont'

clean = -> await $$.remove temp

# test

describe '$$.rename(source, option)', ->

  it "$$.rename('#{temp}/a.txt', 'b.txt')", ->
    await clean()

    source = "#{temp}/a.txt"
    target = "#{temp}/b.txt"
    contSource = 'to be renamed'

    await $$.write source, contSource

    res = await $$.rename source, 'b.txt'

    if res != $$
      throw new Error()

    await check source, target, contSource

    await clean()

  it "$$.rename('#{temp}/a.txt', {extname: '.md', suffix: '-test'})", ->
    await clean()

    source = "#{temp}/a.txt"
    target = "#{temp}/a-test.md"
    contSource = 'to be renamed'

    await $$.write source, contSource

    res = await $$.rename source,
      extname: '.md'
      suffix: '-test'

    if res != $$
      throw new Error()

    await check source, target, contSource

    await clean()

  it "$$.rename('#{temp}/*.txt', extname: '.md')", ->
    await clean()

    listFilename = ($.parseString i for i in [0...5])

    for filename in listFilename
      source = "./temp/#{filename}.txt"
      contSource = filename
      await $$.write source, contSource

    res = await $$.rename "#{temp}/*.txt",
      extname: '.md'

    if res != $$
      throw new Error()

    for filename in listFilename

      source = "./temp/#{filename}.txt"
      target = "./temp/#{filename}.md"
      contSource = filename
      
      await check source, target, contSource

    await clean()