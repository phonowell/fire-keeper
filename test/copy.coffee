# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.copy(source, target, [option])', ->

  it "$$.copy('./license.md', './temp', 'test.md')", ->

    source = './license.md'
    target = './temp/test.md'

    res = await $$.copy source, './temp', 'test.md'

    if res != $$
      throw new Error()

    unless await $$.isExisted target
      throw new Error()

    contSource = await $$.read source
    contTarget = await $$.read target

    if contTarget != contSource
      throw new Error()

    await clean()

  it "$$.copy('./license.md', './temp/new')", ->

    source = './license.md'
    target = './temp/new/license.md'

    res = await $$.copy source, './temp/new'

    if res != $$
      throw new Error()

    unless await $$.isExisted target
      throw new Error()

    contSource = await $$.read source
    contTarget = await $$.read target

    if contTarget != contSource
      throw new Error()

    await clean()

  it "$$.copy('./license.md', '~/Downloads/temp')", ->

    if $$.os != 'macos' then return

    source = './license.md'
    target = '~/Downloads/temp/license.md'

    res = await $$.copy source, '~/Downloads/temp'

    if res != $$
      throw new Error()

    unless await $$.isExisted target
      throw new Error()

    contSource = await $$.read source
    contTarget = await $$.read target

    if contTarget != contSource
      throw new Error()

    await $$.remove '~/Downloads/temp'

  it "$$.copy('./temp/a.txt', null, 'b.txt')", ->

    source = './temp/a.txt'
    target = './temp/b.txt'
    string = 'a string to be copied'

    await $$.write source, string
    res = await $$.copy source, null, 'b.txt'

    if res != $$
      throw new Error()

    unless await $$.isExisted target
      throw new Error()

    cont = await $$.read target

    if cont != string
      throw new Error()

    await clean()