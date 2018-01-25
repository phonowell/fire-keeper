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

  it "$$.compile('./temp/gulpfile.coffee')", ->

    await $$.copy './gulpfile.coffee', './temp'

    res = await $$.compile './temp/gulpfile.coffee'

    if res != $$
      throw new Error()

    unless await $$.isExisted './temp/gulpfile.js'
      throw new Error()

    await clean()

  it "$$.compile('./temp/*.md')", ->

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

  it "$$.compile('./temp/test.coffee', harmony: false)", ->

    await clean()

    source = './temp/test.coffee'
    target = './temp/test.js'

    cont = [
      'class Tester'
      'tester = new Tester()'
      'tester.get = => @'
      'tester.get()'
    ].join '\n'

    await $$.write source, cont

    res = await $$.compile source,
      harmony: false

    if res != $$
      throw new Error 0

    unless await $$.isExisted target
      throw new Error 1

    cont = $.parseString await $$.read target

    if ~cont.search '=>'
      throw new Error 2

    await clean()