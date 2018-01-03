# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test
    
describe '$$.isExisted(source)', ->

  it "$$.isExisted('./temp/existed')", ->

    source = './temp/existed'

    await $$.mkdir source

    unless await $$.isExisted source
      throw new Error()

    await clean()

  it "$$.isExisted('./temp/null')", ->

    if await $$.isExisted './temp/null'
      throw new Error()

    await clean()

  it "$$.isExisted('./temp/existed/existed.txt')", ->

    source = './temp/existed/existed.txt'

    await $$.write source, 'existed'

    unless await $$.isExisted source
      throw new Error()

    await clean()

  it "$$.isExisted('./temp/existed/null.txt')", ->

    await $$.mkdir './temp/existed'

    if await $$.isExisted './temp/existed/null.txt'
      throw new Error()

    await clean()

  it '$$.isExisted([])', ->

    isExisted = await $$.isExisted []

    if isExisted
      throw new Error()

  it "$$.isExisted(['./temp/a', './temp/b', './temp/c'])", ->

    listSource = [
      './temp/a'
      './temp/b'
      './temp/c'
    ]

    await $$.mkdir listSource

    isExisted = await $$.isExisted listSource

    if !isExisted
      throw new Error()

    await clean()

  it "$$.isExisted(['./temp/existed.txt', './temp/null.txt'])", ->

    listSource = [
      './temp/existed.txt'
      './temp/null.txt'
    ]

    await $$.write listSource[0], 'existed'

    isExisted = await $$.isExisted listSource

    if isExisted
      throw new Error()

    await clean()