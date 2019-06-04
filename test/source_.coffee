# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.source_(source)', ->

  it "$.source_('./*.md')", ->
    await clean_()

    listSource = await $.source_ './*.md'

    if listSource.length != 3
      throw new Error()

    await clean_()

  it "$.source_('~/Desktop/*.md')", ->
    await clean_()

    content = 'test text'
    listTarget = [
      '~/Desktop/a.md'
      '~/Desktop/b.md'
      '~/Desktop/c.md'
    ]

    for target in listTarget
      await $.write_ target, content

    listSource = await $.source_ '~/Desktop/*.md'

    if listSource.length != 3
      throw new Error()

    # clean
    await $.remove_ listTarget
    await clean_()
