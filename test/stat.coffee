# require

$$ = require './../index'
{$, _} = $$.library

# variable

temp = './temp'

# function

clean = -> await $$.remove temp

# test

describe '$$.stat(source)', ->

  it '$$.stat("./temp/package.json")', ->
    await clean()

    await $$.copy './package.json', temp

    stat = await $$.stat './package.json'

    if $.type(stat) != 'object'
      throw new Error()

    if $.type(stat.atime) != 'date'
      throw new Error()

    if $.type(stat.size) != 'number'
      throw new Error()

    await clean()

  it '$$.stat("./temp/null.txt")', ->
    await clean()

    stat = await $$.stat "#{temp}/null.txt"

    if stat?
      throw new Error()

    await clean()