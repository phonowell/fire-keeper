# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.download(source, target, [option])', ->

  it "$$.download('http://anitama.cn', './temp', 'anitama.html')", co ->

    res = yield $$.download 'http://anitama.cn'
    , './temp'
    , 'anitama.html'

    if res != $$
      throw new Error()

    unless yield $$.isExisted './temp/anitama.html'
      throw new Error()

    yield clean()

  it "$$.download('http://anitama.cn', './temp', {filename: 'anitama.html', timeout: 1e4})", co ->

    filename = 'anitama.html'
    timeout = 1e4

    res = yield $$.download 'http://anitama.cn'
    , './temp'
    , {filename, timeout}

    if res != $$
      throw new Error()

    unless yield $$.isExisted "./temp/#{filename}"
      throw new Error()

    yield clean()
