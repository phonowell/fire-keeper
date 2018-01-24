# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.source(source)', ->

  it "$$.source('./*.md')", ->

    listSource = await $$.source './*.md'

    if listSource.length != 2
      throw new Error()

  it "$$.source('~/Desktop/*.md')", ->

    content = 'test text'
    listTarget = [
      '~/Desktop/a.md'
      '~/Desktop/b.md'
      '~/Desktop/c.md'
    ]

    for target in listTarget
      await $$.write target, content

    listSource = await $$.source '~/Desktop/*.md'

    if listSource.length != 3
      throw new Error()

    # clean
    await $$.remove listTarget