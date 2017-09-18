# require

$$ = require './../index'
{$, _, Promise} = $$.library
co = Promise.coroutine

# function

clean = co -> yield $$.remove './temp'

# test

describe '$$.fn.formatPath(source)', ->

  it "$$.fn.formatPath('./source')", ->

    source = './source'
    target = [
      $$.fn.normalizePath "#{$$.path.base}/source"
    ]

    res = $$.fn.formatPath source

    unless _.isEqual res, target
      throw new Error()

  it "$$.fn.formatPath(['./source', '~/opt', '!**/include/**'])", ->

    source = [
      './source'
      '~/opt'
      '!**/include/**'
    ]
    target = [
      $$.fn.normalizePath "#{$$.path.base}/source"
      $$.fn.normalizePath "#{$$.path.home}/opt"
      $$.fn.normalizePath "!#{$$.path.base}/**/include/**"
    ]

    res = $$.fn.formatPath source

    unless _.isEqual res, target
      throw new Error()

  it "$$.fn.formatPath('/opt/a/b/../c')", ->

    source = '/opt/a/b/../c'
    target = [
      $$.fn.normalizePath '/opt/a/c'
    ]

    res = $$.fn.formatPath source

    unless _.isEqual res, target
      throw new Error()

describe '$$.fn.normalizePath(source)', ->

  it "$$.fn.normalizePath('./source')", ->

    source = './source'
    target = $$.fn.normalizePath "#{$$.path.base}/source"

    res = $$.fn.normalizePath source

    if res != target
      throw new Error()

  it "$$.fn.normalizePath('~/opt')", ->

    source = '~/opt'
    target = $$.fn.normalizePath "#{$$.path.home}/opt"

    res = $$.fn.normalizePath source

    if res != target
      throw new Error()

  it "$$.fn.normalizePath('./a/b/../c')", ->

    source = './a/b/../c'
    target = $$.fn.normalizePath "#{$$.path.base}/a/c"

    res = $$.fn.normalizePath source

    if res != target
      throw new Error()

  it "$$.fn.normalizePath('../a')", ->

    path = require 'path'

    source = '../a'
    target = path.normalize "#{$$.path.base}/../a"

    res = $$.fn.normalizePath source

    if res != target
      throw new Error()
