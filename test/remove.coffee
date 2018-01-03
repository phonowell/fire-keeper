# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.remove(source)', ->

  it "$$.remove('./temp/re')", ->

    await $$.write './temp/re/move.txt', 'to be removed'

    res = await $$.remove './temp/re'

    if res != $$
      throw new Error()

    if await $$.isExisted './temp/re'
      throw new Error()

    await clean()


  it "$$.remove(['./temp/a', './temp/b', './temp/c.txt'])", ->

    await $$.mkdir [
      './temp/a'
      './temp/b'
    ]

    await $$.write './temp/c.txt', 'empty'

    listSource = [
      './temp/a'
      './temp/b'
      './temp/c.txt'
    ]

    res = await $$.remove listSource

    if res != $$
      throw new Error()

    if await $$.isExisted listSource
      throw new Error()

    await clean()
    
  it "$$.remove('./temp/**/*.txt')", ->
    
    listSource = [
      './temp/a.txt'
      './temp/b/c.txt'
    ]
    string = 'empty'

    for source in listSource
      await $$.write source, string
    
    res = await $$.remove './temp/**/*.txt'
    
    if res != $$
      throw new Error()
      
    if await $$.isExisted listSource
      throw new Error()

    unless await $$.isExisted './temp/b'
      throw new Error()

    await clean()