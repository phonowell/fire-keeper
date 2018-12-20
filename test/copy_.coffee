# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.copy_(source, target, [option])', ->

  it "$.copy_('./license.md', '#{temp}', 'test.md')", ->
    await clean_()

    source = './license.md'
    target = "#{temp}/test.md"

    res = await $.copy_ source, temp, 'test.md'

    if res != $
      throw new Error()

    unless await $.isExisted_ target
      throw new Error()

    contSource = await $.read_ source
    contTarget = await $.read_ target

    if contTarget != contSource
      throw new Error()

    await clean_()

  it "$.copy_('./license.md', '#{temp}/new')", ->
    await clean_()

    source = './license.md'
    target = "#{temp}/new/license.md"

    res = await $.copy_ source, "#{temp}/new"

    if res != $
      throw new Error()

    unless await $.isExisted_ target
      throw new Error()

    contSource = await $.read_ source
    contTarget = await $.read_ target

    if contTarget != contSource
      throw new Error()

    await clean_()

  it "$.copy_('./license.md', '~/Downloads/temp')", ->
    await clean_()

    if $.os != 'macos' then return

    source = './license.md'
    target = '~/Downloads/temp/license.md'

    res = await $.copy_ source, '~/Downloads/temp'

    if res != $
      throw new Error()

    unless await $.isExisted_ target
      throw new Error()

    contSource = await $.read_ source
    contTarget = await $.read_ target

    if contTarget != contSource
      throw new Error()

    await $.remove_ '~/Downloads/temp'

  it "$.copy_('#{temp}/a.txt', null, 'b.txt')", ->
    await clean_()

    source = "#{temp}/a.txt"
    target = "#{temp}/b.txt"
    string = 'a string to be copied'

    await $.write_ source, string
    res = await $.copy_ source, null, 'b.txt'

    if res != $
      throw new Error()

    unless await $.isExisted_ target
      throw new Error()

    cont = await $.read_ target

    if cont != string
      throw new Error()

    await clean_()