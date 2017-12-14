# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.copy(source, target, [option])', ->

  it "$$.copy('./license.md', './temp', 'test.md')", co ->

    source = './license.md'
    target = './temp/test.md'

    res = yield $$.copy source, './temp', 'test.md'

    if res != $$
      throw new Error()

    unless yield $$.isExisted target
      throw new Error()

    contSource = yield $$.read source
    contTarget = yield $$.read target

    if contTarget != contSource
      throw new Error()

    yield clean()

  it "$$.copy('./license.md', './temp/new')", co ->

    source = './license.md'
    target = './temp/new/license.md'

    res = yield $$.copy source, './temp/new'

    if res != $$
      throw new Error()

    unless yield $$.isExisted target
      throw new Error()

    contSource = yield $$.read source
    contTarget = yield $$.read target

    if contTarget != contSource
      throw new Error()

    yield clean()

  it "$$.copy('./license.md', '~/Downloads/temp')", co ->

    if $$.os != 'macos' then return

    source = './license.md'
    target = '~/Downloads/temp/license.md'

    res = yield $$.copy source, '~/Downloads/temp'

    if res != $$
      throw new Error()

    unless yield $$.isExisted target
      throw new Error()

    contSource = yield $$.read source
    contTarget = yield $$.read target

    if contTarget != contSource
      throw new Error()

    yield $$.remove '~/Downloads/temp'

  it "$$.copy('./temp/a.txt', null, 'b.txt')", co ->

    source = './temp/a.txt'
    target = './temp/b.txt'
    string = 'a string to be copied'

    yield $$.write source, string
    res = yield $$.copy source, null, 'b.txt'

    if res != $$
      throw new Error()

    unless yield $$.isExisted target
      throw new Error()

    cont = yield $$.read target

    if cont != string
      throw new Error()

    yield clean()