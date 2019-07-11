it "$.download_('https://www.baidu.com/', '#{temp}', 'baidu.html')", ->
  await clean_()

  result = await $.download_ 'https://www.baidu.com/'
  , temp
  , 'baidu.html'

  unless result == $
    throw 0

  unless await $.isExisted_ "#{temp}/baidu.html"
    throw 1

  await clean_()

it "$.download_('https://www.baidu.com/', '#{temp}', {filename: 'baidu.html', timeout: 1e4})", ->
  await clean_()

  filename = 'baidu.html'
  timeout = 1e4

  result = await $.download_ 'https://www.baidu.com/'
  , temp
  , {filename, timeout}

  unless result == $
    throw 0

  unless await $.isExisted_ "./temp/#{filename}"
    throw 1

  await clean_()