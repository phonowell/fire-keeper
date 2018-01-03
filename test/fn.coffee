# require

$$ = require './../index'
{$, _} = $$.library

# function

clean = -> await $$.remove './temp'

# test

if $$.os == 'windows'
  return

describe '$$.fn.formatPath(source)', ->

  it "$$.fn.formatPath('./source')", ->

    source = './source'
    target = [
      "#{$$.path.base}/source"
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
      "#{$$.path.base}/source"
      "#{$$.path.home}/opt"
      "!#{$$.path.base}/**/include/**"
    ]

    res = $$.fn.formatPath source

    unless _.isEqual res, target
      throw new Error()

  it "$$.fn.formatPath('/opt/a/b/../c')", ->

    source = '/opt/a/b/../c'
    target = [
      '/opt/a/c'
    ]

    res = $$.fn.formatPath source

    unless _.isEqual res, target
      throw new Error()

describe '$$.fn.normalizePath(source)', ->

  it "$$.fn.normalizePath('./source')", ->

    source = './source'
    target = "#{$$.path.base}/source"

    res = $$.fn.normalizePath source

    if res != target
      throw new Error()

  it "$$.fn.normalizePath('~/opt')", ->

    source = '~/opt'
    target = "#{$$.path.home}/opt"

    res = $$.fn.normalizePath source

    if res != target
      throw new Error()

  it "$$.fn.normalizePath('./a/b/../c')", ->

    source = './a/b/../c'
    target = "#{$$.path.base}/a/c"

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