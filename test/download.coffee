# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.download(source, target, [option])', ->

  it "$$.download('https://www.baidu.com/', './temp', 'baidu.html')", co ->

    res = yield $$.download 'https://www.baidu.com/'
    , './temp'
    , 'baidu.html'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/baidu.html'
      throw new Error()

    yield clean()

  it "$$.download('https://www.baidu.com/', './temp', {filename: 'baidu.html', timeout: 1e4})", co ->

    filename = 'baidu.html'
    timeout = 1e4

    res = yield $$.download 'https://www.baidu.com/'
    , './temp'
    , {filename, timeout}

    if res != $$
      throw new Error()

    unless yield $$.isExisted "./temp/#{filename}"
      throw new Error()

    yield clean()