it "$.copy_('./license.md', '#{temp}', 'test.md')", ->
  await clean_()

  source = './license.md'
  target = "#{temp}/test.md"

  result = await $.copy_ source, temp, 'test.md'
  unless result == $
    throw 0

  unless await $.isExisted_ target
    throw 0

  contSource = await $.read_ source
  contTarget = await $.read_ target
  unless contTarget == contSource
    throw 0

  await clean_()

it "$.copy_('./license.md', '#{temp}/new')", ->
  await clean_()

  source = './license.md'
  target = "#{temp}/new/license.md"

  result = await $.copy_ source, "#{temp}/new"
  unless result == $
    throw 0

  unless await $.isExisted_ target
    throw 0

  contSource = await $.read_ source
  contTarget = await $.read_ target
  unless contTarget == contSource
    throw 0

  await clean_()

it "$.copy_('./license.md', '~/Downloads/temp')", ->
  await clean_()

  if $.os != 'macos'
    return

  source = './license.md'
  target = '~/Downloads/temp/license.md'

  result = await $.copy_ source, '~/Downloads/temp'
  unless result == $
    throw 0

  unless await $.isExisted_ target
    throw 0

  contSource = await $.read_ source
  contTarget = await $.read_ target
  unless contTarget == contSource
    throw 0

  await $.remove_ '~/Downloads/temp'

it "$.copy_('#{temp}/a.txt', null, 'b.txt')", ->
  await clean_()

  source = "#{temp}/a.txt"
  target = "#{temp}/b.txt"
  string = 'a string to be copied'

  await $.write_ source, string
  result = await $.copy_ source, null, 'b.txt'
  unless result == $
    throw 0

  unless await $.isExisted_ target
    throw 0

  cont = await $.read_ target
  unless cont == string
    throw 0

  await clean_()

it '[]', ->
  await $.copy_ [], temp