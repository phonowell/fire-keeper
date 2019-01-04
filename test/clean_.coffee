# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.clean_(source)', ->

  ###
  normal
  file left
  folder left
  ###

  it 'normal', ->
    await clean_()

    pathTest = './temp/test.txt'

    await $.write_ pathTest, 'text'
    
    res = await $.clean_ pathTest
    unless res == $
      throw new Error()

    isExisted = await $.isExisted_ pathTest
    if isExisted
      throw new Error()

    isExisted = await $.isExisted_ $.getDirname pathTest
    if isExisted
      throw new Error()

    await clean_()

  it 'file left', ->
    await clean_()

    pathTest = './temp/test.txt'

    await $.write_ pathTest, 'text'
    await $.write_ './temp/another.txt', 'text'
    
    res = await $.clean_ pathTest
    unless res == $
      throw new Error 0

    isExisted = await $.isExisted_ pathTest
    if isExisted
      throw new Error 1

    isExisted = await $.isExisted_ $.getDirname pathTest
    unless isExisted
      throw new Error 2

    await clean_()

  it 'folder left', ->
    await clean_()

    pathTest = './temp/test.txt'

    await $.write_ pathTest, 'text'
    await $.write_ './temp/deep/another.txt', 'text'
    
    res = await $.clean_ pathTest
    unless res == $
      throw new Error()

    isExisted = await $.isExisted_ pathTest
    if isExisted
      throw new Error()

    isExisted = await $.isExisted_ $.getDirname pathTest
    unless isExisted
      throw new Error()

    await clean_()