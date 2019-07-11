it "$.isSame_(['./readme.md', '#{temp}/a.md', '#{temp}/b.md'])", ->
  await clean_()

  listSource = [
    './readme.md'
    "#{temp}/a.md"
    "#{temp}/b.md"
  ]

  await $.chain $
  .copy_ listSource[0], temp, 'a.md'
  .copy_ listSource[0], temp, 'b.md'

  result = await $.isSame_ listSource
  unless result
    throw 0

  await clean_()

it "$.isSame_(['#{temp}/null.txt', './readme.md'])", ->
  await clean_()

  result = await $.isSame_ ["#{temp}/null/txt", './readme.md']
  if result
    throw 0

  await clean_()