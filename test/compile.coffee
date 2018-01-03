# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.compile(source, [target], [option])', ->

  it "$$.compile('./readme.md')", ->

    res = await $$.compile './readme.md', './temp'

    if res != $$
      throw new Error 1

    unless await $$.isExisted './temp/readme.html'
      throw new Error 2

    await clean()

  it "$$.compile('./temp/test.yaml')", ->

    source = './temp/test.yaml'

    await $$.write source, 'test: true'

    res = await $$.compile source

    if res != $$
      throw new Error()

    unless await $$.isExisted './temp/test.json'
      throw new Error()

    await clean()

  it "$$.compile('./gulpfile.coffee')", ->

    res = await $$.compile './gulpfile.coffee', './temp'

    if res != $$
      throw new Error()

    unless await $$.isExisted './temp/gulpfile.js'
      throw new Error()

    await clean()

  it "$$.compile(['./temp/*.md')", ->

    await clean()

    listKey = ['a', 'b', 'c']

    for key in listKey

      await $$.write "./temp/#{key}.md", "# #{key}"

    res = await $$.compile './temp/*.md'

    if res != $$
      throw new Error 1

    for key in listKey

      source = "./temp/#{key}.html"

      unless await $$.isExisted source
        throw new Error 2

      data = await $$.read source

      if data != "<h1 id=\"#{key}\">#{key}</h1>"
        throw new Error 3

    await clean()