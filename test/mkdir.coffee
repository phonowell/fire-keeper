# require

$$ = require './../index'
{$, _} = $$.library

# variable

temp = './temp'

# function

clean = -> await $$.remove temp

# test

describe '$$.mkdir(source)', ->

  it "$$.mkdir('#{temp}/m/k/d/i/r')", ->
    await clean()

    res = await $$.mkdir "#{temp}/m/k/d/i/r"

    if res != $$
      throw new Error()

    unless await $$.isExisted "#{temp}/m/k/d/i/r"
      throw new Error()

    await clean()

  it "$$.mkdir(['#{temp}/a', '#{temp}/b', '#{temp}/c'])", ->
    await clean()

    listSource = [
      "#{temp}/a"
      "#{temp}/b"
      "#{temp}/c"
    ]

    res = await $$.mkdir listSource

    if res != $$
      throw new Error()

    isExisted = await $$.isExisted [
      "#{temp}/a"
      "#{temp}/b"
      "#{temp}/c"
    ]

    if !isExisted
      throw new Error()

    await clean()