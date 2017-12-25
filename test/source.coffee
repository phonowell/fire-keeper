# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.source(source)', ->

  it "$$.source('./*.md')", co ->

    listSource = yield $$.source './*.md'

    if listSource.length != 2
      throw new Error()

  it "$$.source('~/Desktop/*.md')", co ->

    content = 'test text'
    listTarget = [
      '~/Desktop/a.md'
      '~/Desktop/b.md'
      '~/Desktop/c.md'
    ]

    for target in listTarget
      yield $$.write target, content

    listSource = yield $$.source '~/Desktop/*.md'

    if listSource.length != 3
      throw new Error()

    # clean
    yield $$.remove listTarget

  it "$$.source('~/Desktop/[t](e)[s](t).txt')", co ->

    source = '~/Desktop/[t](e)[s](t).txt'
    content = 'just a test file'

    yield $$.write source, content

    source = source
    .replace /\[(\w)/g, '[[]$1'
    .replace /(\w)\]/g, '$1[]]'
    listSource = yield $$.source source

    if listSource.length != 1
      throw new Error()

    # clean
    # yield $$.remove listSource