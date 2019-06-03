# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.download_(source, target, [option])', ->

  it "$.download_('https://www.baidu.com/', '#{temp}', 'baidu.html')", ->
    await clean_()

    res = await $.download_ 'https://www.baidu.com/'
    , temp
    , 'baidu.html'

    if res != $
      throw new Error()

    unless await $.isExisted_ "#{temp}/baidu.html"
      throw new Error()

    await clean_()

  it "$.download_('https://www.baidu.com/', '#{temp}', {filename: 'baidu.html', timeout: 1e4})", ->
    await clean_()

    filename = 'baidu.html'
    timeout = 1e4

    res = await $.download_ 'https://www.baidu.com/'
    , temp
    , {filename, timeout}

    if res != $
      throw new Error()

    unless await $.isExisted_ "./temp/#{filename}"
      throw new Error()

    await clean_()
