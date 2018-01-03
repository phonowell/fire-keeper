# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

describe '$$.download(source, target, [option])', ->

  it "$$.download('https://www.baidu.com/', './temp', 'baidu.html')", ->

    res = await $$.download 'https://www.baidu.com/'
    , './temp'
    , 'baidu.html'

    if res != $$
      throw new Error()

    unless await $$.isExisted './temp/baidu.html'
      throw new Error()

    await clean()

  it "$$.download('https://www.baidu.com/', './temp', {filename: 'baidu.html', timeout: 1e4})", ->

    filename = 'baidu.html'
    timeout = 1e4

    res = await $$.download 'https://www.baidu.com/'
    , './temp'
    , {filename, timeout}

    if res != $$
      throw new Error()

    unless await $$.isExisted "./temp/#{filename}"
      throw new Error()

    await clean()