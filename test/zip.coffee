# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.zip(source, [target], [option])', ->

  it "$$.zip('./temp/*.txt', './temp', 'temp.zip')", ->

    await clean()

    base = './temp'

    for key in ['a', 'b', 'c']

      source = "#{base}/[test](test)#{key}.txt"
      content = "test file #{key}"

      await $$.write source, content

    res = await $$.zip './temp/*.txt', './temp', 'temp.zip'

    if res != $$
      throw new Error()

    unless await $$.isExisted './temp/temp.zip'
      throw new Error()

    await clean()