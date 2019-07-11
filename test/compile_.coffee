it 'default', ->

  type = $.type $.compile_
  unless type == 'asyncfunction'
    throw 0

describe 'coffee', ->

  it 'sourcemaps', ->
    await clean_()

    source = "#{temp}/test.coffee"
    target = "#{temp}/test.js"

    cont = [
      'class Tester'
      'tester = new Tester()'
      'tester.get = => @'
      'tester.get()'
    ].join '\n'

    await $.chain $
    .write_ source, cont
    .compile_ source,
      map: true

    unless await $.isExisted_ target
      throw new Error()

    cont = await $.read_ target
    unless ~cont.search 'sourceMappingURL='
      throw new Error()

    await clean_()

  it 'not sourcemaps', ->
    await clean_()

    source = "#{temp}/test.coffee"
    target = "#{temp}/test.js"

    cont = [
      'class Tester'
      'tester = new Tester()'
      'tester.get = => @'
      'tester.get()'
    ].join '\n'

    await $.chain $
    .write_ source, cont
    .compile_ source

    unless await $.isExisted_ target
      throw new Error()

    cont = await $.read_ target
    if ~cont.search 'sourceMappingURL='
      throw new Error()

    await clean_()

describe 'markdown', ->

  it 'markdown', ->
    await clean_()

    res = await $.compile_ './readme.md', temp
    unless res == $
      throw 0

    isExisted = await $.isExisted_ "#{temp}/readme.html"
    unless isExisted
      throw 1

    await clean_()

describe 'yaml', ->

  it 'yaml', ->
    await clean_()

    source = "#{temp}/test.yaml"

    await $.write_ source, 'test: true'

    res = await $.compile_ source
    unless res == $
      throw 0

    isExisted = await $.isExisted_ "#{temp}/test.json"
    unless isExisted
      throw 1

    await clean_()

describe 'mutli', ->

  it 'mutil', ->
    await clean_()

    listSource = [
      "#{temp}/source/a.md"
      "#{temp}/source/b/b.md"
      "#{temp}/source/b/c/c.md"
    ]

    listTarget = [
      "#{temp}/build/a.html"
      "#{temp}/build/b/b.html"
      "#{temp}/build/b/c/c.html"
    ]

    for source in listSource
      await $.write_ source, '# test'

    await $.compile_ "#{temp}/source/**/*.md", "#{temp}/build"

    isExisted = await $.isExisted_ listTarget
    unless isExisted
      throw new Error()