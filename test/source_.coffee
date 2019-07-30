it './*.md', ->

  listSource = await $.source_ './*.md'

  unless listSource.length == 2
    throw 0

it '~/Desktop/*.md', ->

  content = 'test text'
  listTarget = [
    '~/Desktop/a.md'
    '~/Desktop/b.md'
    '~/Desktop/c.md'
  ]

  for target in listTarget
    await $.write_ target, content

  listSource = await $.source_ '~/Desktop/*.md'

  unless listSource.length == 3
    throw 0

  # clean
  await $.remove_ listTarget