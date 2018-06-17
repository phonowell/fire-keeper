# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

if $.os == 'windows'
  return

describe '$.fn.formatPath(source)', ->

  it "$.fn.formatPath('./source')", ->
    await clean_()

    source = './source'
    target = [
      "#{$.path.base}/source"
    ]

    res = $.fn.formatPath source

    unless _.isEqual res, target
      throw new Error()

    await clean_()

  it "$.fn.formatPath(['./source', '~/opt', '!**/include/**'])", ->
    await clean_()

    source = [
      './source'
      '~/opt'
      '!**/include/**'
    ]
    target = [
      "#{$.path.base}/source"
      "#{$.path.home}/opt"
      "!#{$.path.base}/**/include/**"
    ]

    res = $.fn.formatPath source

    unless _.isEqual res, target
      throw new Error()

    await clean_()

  it "$.fn.formatPath('/opt/a/b/../c')", ->
    await clean_()

    source = '/opt/a/b/../c'
    target = [
      '/opt/a/c'
    ]

    res = $.fn.formatPath source

    unless _.isEqual res, target
      throw new Error()

    await clean_()

describe '$.fn.normalizePath(source)', ->

  it "$.fn.normalizePath('./source')", ->
    await clean_()

    source = './source'
    target = "#{$.path.base}/source"

    res = $.fn.normalizePath source

    if res != target
      throw new Error()

    await clean_()

  it "$.fn.normalizePath('~/opt')", ->
    await clean_()

    source = '~/opt'
    target = "#{$.path.home}/opt"

    res = $.fn.normalizePath source

    if res != target
      throw new Error()

    await clean_()

  it "$.fn.normalizePath('./a/b/../c')", ->
    await clean_()

    source = './a/b/../c'
    target = "#{$.path.base}/a/c"

    res = $.fn.normalizePath source

    if res != target
      throw new Error()

    await clean_()

  it "$.fn.normalizePath('../a')", ->
    await clean_()

    path = require 'path'

    source = '../a'
    target = path.normalize "#{$.path.base}/../a"

    res = $.fn.normalizePath source

    if res != target
      throw new Error()

    await clean_()