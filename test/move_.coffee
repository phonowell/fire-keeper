# require
$ = require './../index'
{_} = $

# variable
temp = './temp'

# function
clean_ = -> await $.remove_ temp

# test

describe '$.move_(source, target)', ->

  describe 'file', ->

    it 'existed', ->
      await clean_()

      source = "#{temp}/source/test.txt"

      await $.chain $
      .write_ source, 'test message'
      .move_ source, "#{temp}/target"

      isExisted = await $.isExisted_ "#{temp}/target/test.txt"
      unless isExisted
        throw new Error()

      await clean_()

    it 'not existed', ->
      await clean_()

      await $.move_ "#{temp}/source/test.txt", "#{temp}/target"

      isExisted = await $.isExisted_ "#{temp}/target/test.txt"
      if isExisted
        throw new Error()

      await clean_()

  describe 'folder', ->

    it 'existed', ->
      await clean_()

      await $.chain $
      .write_ "#{temp}/source/test.txt", 'test message'
      .move_ "#{temp}/source/**/*", "#{temp}/target"

      isExisted = await $.isExisted_ "#{temp}/target/test.txt"
      unless isExisted
        throw new Error()

      await clean_()

    it 'not existed', ->
      await clean_()

      await $.move_ "#{temp}/source/**/*", "#{temp}/target"

      isExisted = await $.isExisted_ "#{temp}/target/test.txt"
      if isExisted
        throw new Error()

      await clean_()