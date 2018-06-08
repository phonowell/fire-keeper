# require

$ = require './../index'
{_} = $.library

# variable

temp = './temp'

# function

clean = -> await $.remove temp

# test

describe '$.download(source, target, [option])', ->

  it "$.download('https://www.baidu.com/', '#{temp}', 'baidu.html')", ->
    await clean()

    res = await $.download 'https://www.baidu.com/'
    , temp
    , 'baidu.html'

    if res != $
      throw new Error()

    unless await $.isExisted "#{temp}/baidu.html"
      throw new Error()

    await clean()

  it "$.download('https://www.baidu.com/', '#{temp}', {filename: 'baidu.html', timeout: 1e4})", ->
    await clean()

    filename = 'baidu.html'
    timeout = 1e4

    res = await $.download 'https://www.baidu.com/'
    , temp
    , {filename, timeout}

    if res != $
      throw new Error()

    unless await $.isExisted "./temp/#{filename}"
      throw new Error()

    await clean()