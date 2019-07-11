describe 'file', ->

  it 'existed', ->
    await clean_()

    source = "#{temp}/source/test.txt"

    await $.chain $
    .write_ source, 'test message'
    .move_ source, "#{temp}/target"

    isExisted = await $.isExisted_ "#{temp}/target/test.txt"
    unless isExisted
      throw 0

    await clean_()

  it 'not existed', ->
    await clean_()

    await $.move_ "#{temp}/source/test.txt", "#{temp}/target"

    isExisted = await $.isExisted_ "#{temp}/target/test.txt"
    if isExisted
      throw 0

    await clean_()

describe 'folder', ->

  it 'existed', ->
    await clean_()

    await $.chain $
    .write_ "#{temp}/source/test.txt", 'test message'
    .move_ "#{temp}/source/**/*", "#{temp}/target"

    isExisted = await $.isExisted_ "#{temp}/target/test.txt"
    unless isExisted
      throw 0

    await clean_()

  it 'not existed', ->
    await clean_()

    await $.move_ "#{temp}/source/**/*", "#{temp}/target"

    isExisted = await $.isExisted_ "#{temp}/target/test.txt"
    if isExisted
      throw 0

    await clean_()

describe 'outer', ->

  it 'existed', ->

    base = '~/Downloads'

    await $.chain $
    .write_ "#{base}/source/test.txt", 'test message'
    .move_ "#{base}/source/test.txt", "#{base}/target"

    isExisted = await $.isExisted_ "#{base}/target/test.txt"
    unless isExisted
      throw 0

    await $.remove_ [
      "#{base}/source"
      "#{base}/target"
    ]

  it 'not existed', ->

    base = '~/Downloads'

    await $.move_ "#{base}/source/test.txt", "#{base}/target"

    isExisted = await $.isExisted_ "#{base}/target/test.txt"
    if isExisted
      throw 0

    await $.remove_ [
      "#{base}/source"
      "#{base}/target"
    ]

describe 'other', ->
  it '[]', -> await $.move_ [], temp