# require

$$ = require './../index'
{$, _} = $$.library

# variable

temp = './temp'

# function

clean = -> await $$.remove temp

# test

if $$.os == 'windows'
  return

describe '$$.fn.formatPath(source)', ->

  it "$$.fn.formatPath('./source')", ->
    await clean()

    source = './source'
    target = [
      "#{$$.path.base}/source"
    ]

    res = $$.fn.formatPath source

    unless _.isEqual res, target
      throw new Error()

    await clean()

  it "$$.fn.formatPath(['./source', '~/opt', '!**/include/**'])", ->
    await clean()

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

    await clean()

  it "$$.fn.formatPath('/opt/a/b/../c')", ->
    await clean()

    source = '/opt/a/b/../c'
    target = [
      '/opt/a/c'
    ]

    res = $$.fn.formatPath source

    unless _.isEqual res, target
      throw new Error()

    await clean()

describe '$$.fn.normalizePath(source)', ->

  it "$$.fn.normalizePath('./source')", ->
    await clean()

    source = './source'
    target = "#{$$.path.base}/source"

    res = $$.fn.normalizePath source

    if res != target
      throw new Error()

    await clean()

  it "$$.fn.normalizePath('~/opt')", ->
    await clean()

    source = '~/opt'
    target = "#{$$.path.home}/opt"

    res = $$.fn.normalizePath source

    if res != target
      throw new Error()

    await clean()

  it "$$.fn.normalizePath('./a/b/../c')", ->
    await clean()

    source = './a/b/../c'
    target = "#{$$.path.base}/a/c"

    res = $$.fn.normalizePath source

    if res != target
      throw new Error()

    await clean()

  it "$$.fn.normalizePath('../a')", ->
    await clean()

    path = require 'path'

    source = '../a'
    target = path.normalize "#{$$.path.base}/../a"

    res = $$.fn.normalizePath source

    if res != target
      throw new Error()

    await clean()