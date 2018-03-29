# require

$$ = require './../index'
{$, _} = $$.library

# variable

temp = './temp'

# function

clean = -> await $$.remove temp

# test
    
describe '$$.isExisted(source)', ->

  it "$$.isExisted('#{temp}/existed')", ->
    await clean()

    source = "#{temp}/existed"

    await $$.mkdir source

    unless await $$.isExisted source
      throw new Error()

    await clean()

  it "$$.isExisted('#{temp}/null')", ->
    await clean()

    if await $$.isExisted "#{temp}/null"
      throw new Error()

    await clean()

  it "$$.isExisted('#{temp}/existed/existed.txt')", ->
    await clean()

    source = "#{temp}/existed/existed.txt"

    await $$.write source, 'existed'

    unless await $$.isExisted source
      throw new Error()

    await clean()

  it "$$.isExisted('#{temp}/existed/null.txt')", ->
    await clean()

    await $$.mkdir "#{temp}/existed"

    if await $$.isExisted "#{temp}/existed/null.txt"
      throw new Error()

    await clean()

  it '$$.isExisted([])', ->
    await clean()

    isExisted = await $$.isExisted []

    if isExisted
      throw new Error()

    await clean()

  it "$$.isExisted(['#{temp}/a', '#{temp}/b', '#{temp}/c'])", ->
    await clean()

    listSource = [
      "#{temp}/a"
      "#{temp}/b"
      "#{temp}/c"
    ]

    await $$.mkdir listSource

    isExisted = await $$.isExisted listSource

    if !isExisted
      throw new Error()

    await clean()

  it "$$.isExisted(['#{temp}/existed.txt', '#{temp}/null.txt'])", ->
    await clean()

    listSource = [
      "#{temp}/existed.txt"
      "#{temp}/null.txt"
    ]

    await $$.write listSource[0], 'existed'

    isExisted = await $$.isExisted listSource

    if isExisted
      throw new Error()

    await clean()