# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.compile_(source, [target], [option])', ->

  it "$.compile_('./readme.md')", ->
    await clean_()

    res = await $.compile_ './readme.md', temp

    if res != $
      throw new Error 1

    unless await $.isExisted_ "#{temp}/readme.html"
      throw new Error 2

    await clean_()

  it "$.compile_('#{temp}/test.yaml')", ->
    await clean_()

    source = "#{temp}/test.yaml"

    await $.write_ source, 'test: true'

    res = await $.compile_ source

    if res != $
      throw new Error()

    unless await $.isExisted_ "#{temp}/test.json"
      throw new Error()

    await clean_()

  it "$.compile_('#{temp}/gulpfile.coffee')", ->
    await clean_()

    await $.copy_ './gulpfile.coffee', temp

    res = await $.compile_ "#{temp}/gulpfile.coffee"

    if res != $
      throw new Error()

    unless await $.isExisted_ "#{temp}/gulpfile.js"
      throw new Error()

    await clean_()

  it "$.compile_('#{temp}/*.md')", ->
    await clean_()

    listKey = ['a', 'b', 'c']

    for key in listKey

      await $.write_ "#{temp}/#{key}.md", "# #{key}"

    res = await $.compile_ "#{temp}/*.md"

    if res != $
      throw new Error 1

    for key in listKey

      source = "#{temp}/#{key}.html"

      unless await $.isExisted_ source
        throw new Error 2

      data = await $.read_ source

      if data != "<h1 id=\"#{key}\">#{key}</h1>"
        throw new Error 3

    await clean_()

  it "$.compile_('#{temp}/test.coffee', harmony: false)", ->
    await clean_()

    source = "#{temp}/test.coffee"
    target = "#{temp}/test.js"

    cont = [
      'class Tester'
      'tester = new Tester()'
      'tester.get = => @'
      'tester.get()'
    ].join '\n'

    await $.write_ source, cont

    res = await $.compile_ source,
      harmony: false

    if res != $
      throw new Error 0

    unless await $.isExisted_ target
      throw new Error 1

    cont = await $.read_ target

    if ~cont.search '=>'
      throw new Error 2

    await clean_()